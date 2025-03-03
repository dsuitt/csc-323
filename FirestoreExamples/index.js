const {Firestore} = require("@google-cloud/firestore");

const firestore = new Firestore();

async function examples(){

firestore.collection('users').get().then((snapshot) => { //gets all users
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
});

// create a user
firestore.collection('users').doc('1932b031-bce0-4800-80a4-7fdb65f94b8a').set({
    name: 'John Doe',
    email: 'JohnDoe@example.com',
});

// update a user
firestore.collection('users').doc('1932b031-bce0-4800-80a4-7fdb65f94b8a').update({
    name: 'Jane Doe',
});

//get all tasks in the project
firestore.collection('projects').doc('1932b031-bce0-4800-80a4-7fdb65f94b8a').collection('tasks').get().then((snapshot) => {
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
});
}

const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
};
firestore.collection('users').doc('newUser2').set(userData).then((doc) => {
    console.log('User created successfully');
}).catch((error) => {
    console.error('Error creating user:', error);
});