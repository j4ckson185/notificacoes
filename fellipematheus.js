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

// Preload audio element
const audio = new Audio('/assets/notification.mp3');
document.addEventListener('click', () => {
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });
}, { once: true });

// Reference to the "messages/fellipematheus" node in the Realtime Database
const userMessagesRef = ref(database, 'messages/fellipematheus');

// Listen for new messages added to "messages/fellipematheus"
onChildAdded(userMessagesRef, (snapshot) => {
    const messageData = snapshot.val();
    console.log('New message added:', messageData);  // Log message data for debugging
    
    // Create a new div element for the message
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Check if messageData has text property
    if (messageData && messageData.text) {
        messageElement.textContent = messageData.text;
        console.log('Message text:', messageData.text);  // Log message text for debugging
    } else {
        messageElement.textContent = 'Mensagem sem texto';
        console.log('MessageData does not contain text property');  // Log missing text property
    }
    
    // Append the message element to the messages container
    messagesContainer.appendChild(messageElement);

    // Play notification sound
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });
});

// Listen for FCM messages when the page is in the foreground
onMessage(messaging, (payload) => {
    console.log('Received FCM message:', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png'
    };

    // Play notification sound
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });

    // Display the notification
    new Notification(notificationTitle, notificationOptions);
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
