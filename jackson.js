import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getMessaging, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

// DOM elements
const messagesContainer = document.getElementById('messages-container');
const clearMessagesButton = document.getElementById('clearMessagesButton');
const logoutButton = document.getElementById('logoutButton');

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(err => {
            console.error('Error registering Service Worker:', err);
        });
}

// Reference to the "messages/jackson" node in the Realtime Database
const userMessagesRef = ref(database, 'messages/jackson');

// Listen for new messages added to "messages/jackson"
onChildAdded(userMessagesRef, (snapshot) => {
    const messageData = snapshot.val();
    console.log('New message added:', messageData);  // Log message data for debugging

    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messagesContainer.appendChild(messageElement);

    // Play notification sound
    const audio = new Audio('/assets/notification.mp3');
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });
});

// Listen for FCM messages
onMessage(messaging, (payload) => {
    console.log('Received FCM message:', payload);

    // Play notification sound
    const audio = new Audio('/assets/notification.mp3');
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });

    // Display the notification
    const messageElement = document.createElement('div');
    messageElement.textContent = payload.notification.body;
    messagesContainer.appendChild(messageElement);
});

// Clear all messages
clearMessagesButton.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
});

// Logout
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('Signed out');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
