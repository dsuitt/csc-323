const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();
const db = firestore;

async function handleVote(cloudEvent) {
    try {
        const data = decodeFirestoreEvent(cloudEvent);
        if (!data) return res.status(400).send("Invalid Firestore event");

        const { pollId, voteId } = data.params;
        const voteData = data.value.fields;

        console.log(`New vote detected: ${voteId} on poll ${pollId}`);

        const pollRef = db.collection("polls").doc(pollId);
        const pollDoc = await pollRef.get();

        if (!pollDoc.exists) {
            console.warn(`Poll ${pollId} does not exist.`);
            return res.status(404).send("Poll not found");
        }

        const pollData = pollDoc.data();
        if (!pollData.isOpen) {
            console.log(`Poll ${pollId} is closed. Ignoring vote.`);
            return res.status(403).send("Poll is closed");
        }

        // Check if poll is expired
        const now = new Date();
        if (pollData.expiration.toDate() < now) {
            await pollRef.update({ isOpen: false });
            console.log(`Poll ${pollId} expired. Closing poll.`);
            return res.status(403).send("Poll expired, vote not counted");
        }

        // Update vote count
        const option = voteData.option.stringValue;
        const newVotes = { ...pollData.votes };
        newVotes[option] = (newVotes[option] || 0) + 1;

        await pollRef.update({ votes: newVotes });

        console.log(`Vote counted for poll ${pollId}, option: ${option}`);
        return res.status(200).send("Vote counted successfully");

    } catch (error) {
        console.error("Error processing Firestore event:", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Function to decode Firestore CloudEvent payload using Protobuf
function decodeFirestoreEvent(cloudEvent) {
    try {
        const eventData = cloudEvent.data;
        if (!eventData || !eventData.value) {
            console.warn("Invalid event data");
            return null;
        }

        // Extract document path (e.g., "polls/{pollId}/votes/{voteId}")
        const resourcePath = eventData.value.name.split("/");
        const pollId = resourcePath[resourcePath.indexOf("polls") + 1];
        const voteId = resourcePath[resourcePath.indexOf("votes") + 1];

        // Decode Firestore fields using Protobuf
        const decodedFields = {};
        for (const [key, value] of Object.entries(eventData.value.fields)) {
            decodedFields[key] = Value.decode(value);
        }

        return {
            params: { pollId, voteId },
            value: { fields: decodedFields },
        };
    } catch (error) {
        console.error("Error decoding Firestore event:", error);
        return null;
    }
}