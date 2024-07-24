import { getDatabase, ref, onValue, messaging, getToken, onMessage, auth, signOut } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');
const messagesRef = ref(getDatabase(), 'messages');
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
}).catch((err) => {
    console.error('Error getting token:', err);
});

// Clear all messages
clearMessagesButton.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
});

// Logout
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log('Signed out');
            window.location.href = 'index.html'; // Redirect to index.html
        })
        .catch((error) => {
            // An error happened.
            console.error('Error signing out:', error);
        });
});
