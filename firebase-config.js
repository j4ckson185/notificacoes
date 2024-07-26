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

(function() {
    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized');

        // Get Firebase services after initialization
        window.firebaseDatabase = firebase.database();
        window.firebaseAuth = firebase.auth();
        if (firebase.messaging.isSupported()) {
            try {
                window.firebaseMessaging = firebase.messaging();
            } catch (error) {
                console.error("Firebase messaging is not available:", error);
            }
        } else {
            console.warn("Firebase messaging is not supported on this browser.");
        }
        window.firebaseInitialized = true;
        console.log('Firebase services initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase services:', error);
        window.firebaseInitialized = false;
    }
})();
