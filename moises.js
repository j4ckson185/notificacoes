import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getMessaging, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const messaging = getMessaging(app);

const messagesContainer = document.getElementById('messages-container');
const clearMessagesButton = document.getElementById('clearMessagesButton');
const logoutButton = document.getElementById('logoutButton');

function displayMessage(data) {
    const messageElement = document.createElement('div');
    if (data.text) {
        messageElement.textContent = data.text;
    } else if (data.notification && data.notification.body) {
        messageElement.textContent = data.notification.body;
    } else {
        messageElement.textContent = 'Mensagem sem texto';
    }
    messagesContainer.appendChild(messageElement);
}

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

// Listen for changes in the Realtime Database
const messagesRef = ref(database, 'messages/moises');
onValue(messagesRef, (snapshot) => {
    messagesContainer.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        displayMessage(messageData);
    });
});

// Listen for FCM messages
onMessage(messaging, (payload) => {
    console.log('Received FCM message:', payload);
    displayMessage(payload.data);
});

// Clear all messages
clearMessagesButton.addEventListener('click', () => {
    remove(messagesRef).then(() => {
        messagesContainer.innerHTML = '';
        console.log('All messages cleared.');
    }).catch((error) => {
        console.error('Error clearing messages:', error);
    });
});

// Logout
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
