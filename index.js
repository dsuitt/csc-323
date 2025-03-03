const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

async function formatTranscript(docPath) {
    try {
        const docRef = db.doc(docPath);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            console.log("Document does not exist.");
            return;
        }

        const data = docSnapshot.data();
        if (!data.transcript || !Array.isArray(data.transcript)) {
            console.log("Transcript field is missing or not an array.");
            return;
        }

        const updatedTranscript = data.transcript.map(entry => {
            if (entry.content && typeof entry.content === "string") {
                const len = entry.content.length;
                const chunkSize = Math.ceil(len / 3);
                const formattedContent = entry.content
                    .match(new RegExp(`.{1,${chunkSize}}`, "g"))
                    .join("\n");

                return { ...entry, content: formattedContent };
            }
            return entry;
        });

        await docRef.update({ transcript: updatedTranscript });

        console.log("Transcript updated successfully.");
    } catch (error) {
        console.error("Error updating transcript:", error);
    }
}

// Call function with the Firestore document path
formatTranscript(
    "/post_meeting_summaries/users/bKWeVcMtIWQ7KTJkXSZJq9f6VRg1/completed/appointments/gTCL4Xl9Ni0iqOBuqKQN"
);