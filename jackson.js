// jackson.js
import { getDatabase } from './firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getMessaging, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth } from './firebase-config.js'; // Importando getAuth

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');

    const messagesContainer = document.getElementById('messages-container');
    const clearMessagesButton = document.getElementById('clearMessagesButton');
    const logoutButton = document.getElementById('logoutButton');

    if (!messagesContainer || !clearMessagesButton || !logoutButton) {
        console.error('Um ou mais elementos não foram encontrados no DOM.');
        return;
    }

    // Initialize Firebase services
    const database = getDatabase();
    const messaging = getMessaging();
    const auth = getAuth(); // Obter a instância do auth

    // Listen for changes in the Realtime Database
    onValue(ref(database, 'messages'), (snapshot) => {
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

    // Listen for FCM messages
    if (messaging) {
        onMessage(messaging, (payload) => {
            console.log('Received FCM message:', payload);
            const messageData = payload.data;
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.text || 'Mensagem sem texto';
            messagesContainer.appendChild(messageElement);
        });
    }

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
