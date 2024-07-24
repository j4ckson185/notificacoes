import { getDatabase, ref, onValue, messaging, getToken, onMessage } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');
const messagesRef = ref(getDatabase(), 'messages');

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
onValue(messagesRef, (snapshot) => {
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.text;
            messagesContainer.appendChild(messageElement);
        });
    }
});

// Listen for FCM messages
onMessage(messaging, (payload) => {
    console.log('Received FCM message:', payload);
    // Handle the message (e.g., display a notification)
});

// Get FCM token
getToken(messaging).then((currentToken) => {
    if (currentToken) {
        // Send the token to your backend server
        console.log('FCM Token:', currentToken);
        // ... your code to send the token to your server ...
    } else {
        console.error('No registration token available.');
    }
}).catch
