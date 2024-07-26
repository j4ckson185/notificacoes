// jackson.js
import { database, auth, messaging } from './firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const clearMessagesButton = document.getElementById('clearMessagesButton');
    const logoutButton = document.getElementById('logoutButton');

    // Verifica se os serviços do Firebase foram inicializados corretamente
    if (!database || !auth) {
        console.error('Firebase services not initialized.');
        return;
    }

    // Registrar o Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(err => {
                console.error('Erro ao registrar Service Worker:', err);
            });
    }

    // Escuta alterações no banco de dados em tempo real
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

    // Escuta mensagens do FCM
    if (messaging) {
        onMessage(messaging, (payload) => {
            console.log('Mensagem recebida do FCM:', payload);
            const messageData = payload.data;
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.text || 'Mensagem sem texto';
            messagesContainer.appendChild(messageElement);
        });
    }

    // Limpa todas as mensagens
    clearMessagesButton.addEventListener('click', () => {
        remove(ref(database, 'messages'));
        messagesContainer.innerHTML = '';
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('Desconectado');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Erro ao desconectar:', error);
            });
    });
});
