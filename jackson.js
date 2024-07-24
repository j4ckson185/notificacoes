import { getDatabase, ref, onValue, messaging, getToken, onMessage, auth, signOut } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');
const messagesRef = ref(getDatabase(), 'messages/jackson');
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
        messagesContainer.innerHTML = ''; // Clear previous messages
        snapshot.forEach((childSnapshot) => {
            const messageData = childSnapshot.val();
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.text;
            messagesContainer.appendChild(messageElement);

            // Play notification sound
            const audio = new Audio('/assets/notification.mp3');
            audio.play().catch((error) => {
                console.error('Error playing notification sound:', error);
            });
        });
    }
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
    const notificationElement = document.createElement('div');
    notificationElement.textContent = payload.notification.body;
    messagesContainer.appendChild(notificationElement);
});

// Get FCM token
getToken(messaging).then((currentToken) => {
    if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Send the token to your backend server
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
            console.log('Signed out');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
