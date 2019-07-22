const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getUserData = functions.https.onRequest((req, res) => {
    db.collection("users").doc(req.query.user).get()
        .then(doc => {
            res.status(200).json(doc.data());
        })
})