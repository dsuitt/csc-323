const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Generate a large dataset
const users = Array.from({ length: 20 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i < 5 ? "admin" : i < 10 ? "manager" : "member",
}));

const projects = Array.from({ length: 10 }, (_, i) => ({
  name: `Project ${i + 1}`,
  description: `Description for Project ${i + 1}`,
}));

const taskTitles = [
  "Create UI Components",
  "Develop API",
  "Write Tests",
  "Deploy to Firebase",
  "Set Up Database",
  "Fix Bugs",
  "Review Code",
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

    for (let i = 0; i < 50; i++) {
      const taskId = uuidv4();
      const assignedTo = Object.keys(userDocs)[Math.floor(Math.random() * Object.keys(userDocs).length)];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30 - 15)); // Some tasks overdue

      await db.collection("projects").doc(projectId).collection("tasks").doc(taskId).set({
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        assignedTo,
        dueDate: dueDate.toISOString(),
        status: ["todo", "in-progress", "completed"][Math.floor(Math.random() * 3)],
      });

      await db.collection("users").doc(assignedTo).update({
        assignedTasks: admin.firestore.FieldValue.arrayUnion(taskId),
      });
    }

    for (let i = 0; i < 5; i++) {
      const reportId = uuidv4();
      const createdBy = Object.keys(userDocs)[Math.floor(Math.random() * Object.keys(userDocs).length)];

      await db.collection("reports").doc(reportId).set({
        projectId,
        createdBy,
        summary: `Project ${project.name} report`,
        createdAt: new Date().toISOString(),
      });
    }
  }

  console.log("Seeding complete.");
}

seedFirestore();