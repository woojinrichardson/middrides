// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

const createUser = (user, context) => {
  return db.collection('users').doc(user.uid).set({
    name: user.displayName,
    email: user.email,
    role: 'user',
  }).catch(console.error);
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createUser),
};
