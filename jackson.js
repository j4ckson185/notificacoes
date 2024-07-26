// jackson.js
import { database, ref, onValue } from './firebase-config.js';  // Corrigir importações

document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const clearMessagesButton = document.getElementById('clearMessagesButton');
    const logoutButton = document.getElementById('logoutButton');

    if (!database) {
        console.error('Firebase services not initialized.');
        return;
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
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                const messageData = childSnapshot.val();
                const messageElement = document.createElement('div');
                messageElement.textContent = messageData.text || 'Mensagem sem texto';
                messagesContainer.appendChild(messageElement);
            });
        }
    });

    // Clear all messages
    clearMessagesButton.addEventListener('click', () => {
        ref(database, 'messages').remove();
        messagesContainer.innerHTML = '';
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                console.log('Signed out');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
});
