const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// entrypoint for the API
exports.handleRequest = functions.http(async (req, res) => {
    try {
        const path = req.path.split('/').filter(Boolean); // Extract path segments
        const method = req.method;

        // Route requests based on path and method
        if (method === "POST" && path[0] === "users") {
            return createUser(req, res);
        }
        if (method === "POST" && path[0] === "polls") {
            return createPoll(req, res);
        }
        if (method === "POST" && path[0] === "polls" && path[2] === "vote") {
            return voteOnPoll(req, res, path[1]);
        }
        if (method === "GET" && path[0] === "polls" && path.length === 2) {
            return getPollResults(req, res, path[1]);
        }
        if (method === "GET" && path[0] === "polls") {
            return getExpiringPolls(req, res);
        }
        if (method === "DELETE" && path[0] === "polls" && path.length === 2) {
            return deletePoll(req, res, path[1]);
        }

        return res.status(404).send("Invalid API request");
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Create User
async function createUser(req, res) {
    const { username } = req.body;
    if (!username) return res.status(400).send("Username is required");

    const userRef = db.collection("users").doc(username);
    const userDoc = await userRef.get();

    if (userDoc.exists) return res.status(409).send("User already exists");

    await userRef.set({ createdAt: admin.firestore.Timestamp.now()});
    return res.status(201).send({ message: "User created", username });
}

// Create Poll
async function createPoll(req, res) {
    const { owner, question, options, expiration } = req.body;
    if (!owner || !question || !options || !expiration) return res.status(400).send("Missing fields");

    const pollRef = db.collection("polls").doc();
    await pollRef.set({
        owner,
        question,
        options,
        votes: {},
        isOpen: true,
        expiration: admin.firestore.Timestamp.fromDate(new Date(expiration))
    });

    return res.status(201).send({ pollId: pollRef.id, message: "Poll created" });
}

// Vote on Poll
async function voteOnPoll(req, res, pollId) {
    const { userId, option } = req.body;
    if (!userId || !option) return res.status(400).send("Missing fields");

    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) return res.status(404).send("Poll not found");
    if (!pollDoc.data().isOpen) return res.status(403).send("Poll is closed");

    const voteRef = pollRef.collection("votes").doc(userId);
    const voteDoc = await voteRef.get();

    if (voteDoc.exists) return res.status(409).send("User has already voted");

    await voteRef.set({ option, votedAt: admin.firestore.Timestamp.now() });

    return res.status(200).send({ message: "Vote cast successfully" });
}

// Retrieve Poll Results
async function getPollResults(req, res, pollId) {
    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) return res.status(404).send("Poll not found");

    return res.status(200).json(pollDoc.data());
}

// Query Expiring Polls
async function getExpiringPolls(req, res) {
    const { owner, expiresBefore } = req.query;
    if (!owner || !expiresBefore) return res.status(400).send("Missing query parameters");

    const timestamp = admin.firestore.Timestamp.fromDate(new Date(expiresBefore));

    const pollsQuery = await db.collection("polls")
        .where("owner", "==", owner)
        .where("expiration", "<", timestamp)
        .get();

    const results = pollsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(results);
}

// Delete Poll (Only by Owner)
async function deletePoll(req, res, pollId) {
    const { owner } = req.body;

    const pollRef = db.collection("polls").doc(pollId);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) return res.status(404).send("Poll not found");
    if (pollDoc.data().owner !== owner) return res.status(403).send("Unauthorized");

    await pollRef.delete();
    return res.status(200).send("Poll deleted");
}