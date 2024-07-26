// firebase-config.js
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    measurementId: "G-96Y337GYT8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services after initialization
const database = firebase.database();
const auth = firebase.auth();
let messaging;
try {
    messaging = firebase.messaging();
} catch (error) {
    console.error("Firebase messaging is not available:", error);
}

// Expose the initialized services globally
window.firebaseDatabase = database;
window.firebaseAuth = auth;
if (messaging) {
    window.firebaseMessaging = messaging;
}
