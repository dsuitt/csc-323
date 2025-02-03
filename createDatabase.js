const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Sample Users
const users = [
    { name: "Alice Johnson", email: "alice@example.com", role: "admin" },
    { name: "Bob Smith", email: "bob@example.com", role: "manager" },
    { name: "Charlie Lee", email: "charlie@example.com", role: "member" },
    { name: "David Kim", email: "david@example.com", role: "member" },
];

// Sample Projects
const projects = [
    { name: "Website Redesign", description: "Redesigning the company website" },
    { name: "Mobile App Development", description: "Creating a new mobile app" },
    { name: "Cloud Migration", description: "Migrating services to Google Cloud" },
];

// Sample Task Titles
const taskTitles = [
    "Create Wireframes",
    "Set Up Firebase",
    "Develop Authentication",
    "Design UI Components",
    "Write Documentation",
];

// Function to seed Firestore
async function seedFirestore() {
    console.log("Seeding Firestore...");

    let userDocs = {};
    for (let user of users) {
        const userId = uuidv4();
        await db.collection("users").doc(userId).set({ ...user, assignedTasks: [] });
        userDocs[userId] = user;
    }

    for (let project of projects) {
        const projectId = uuidv4();
        const createdBy = Object.keys(userDocs)[Math.floor(Math.random() * Object.keys(userDocs).length)];

        await db.collection("projects").doc(projectId).set({
            name: project.name,
            description: project.description,
            createdBy,
            members: Object.keys(userDocs),
        });

        for (let i = 0; i < 3; i++) {
            const taskId = uuidv4();
            const assignedTo = Object.keys(userDocs)[Math.floor(Math.random() * Object.keys(userDocs).length)];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 10 + 1));

            await db.collection("projects").doc(projectId).collection("tasks").doc(taskId).set({
                title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
                assignedTo,
                dueDate: dueDate.toISOString(),
                status: "todo",
            });

            await db.collection("users").doc(assignedTo).update({
                assignedTasks: admin.firestore.FieldValue.arrayUnion(taskId),
            });
        }
    }

    for (let i = 0; i < 2; i++) {
        const reportId = uuidv4();
        const projectId = Object.keys(projects)[Math.floor(Math.random() * projects.length)];
        const createdBy = Object.keys(userDocs)[Math.floor(Math.random() * Object.keys(userDocs).length)];

        await db.collection("reports").doc(reportId).set({
            projectId,
            createdBy,
            summary: "Report on project progress.",
            createdAt: new Date().toISOString(),
        });
    }

    console.log("Firestore seeding completed!");
}

seedFirestore();