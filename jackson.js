import { getDatabase, ref, onValue, getMessaging, getToken, onMessage, messaging } from './firebase-config.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');

    // Referência para o nó "messages" no Realtime Database
    const messagesRef = ref(getDatabase(), 'messages');

    // Ouvir por mudanças no nó "messages"
    onValue(messagesRef, (snapshot) => {
        if (messagesContainer) {
            // Limpar o conteúdo do container de mensagens
            messagesContainer.innerHTML = '';

            // Iterar sobre os filhos do nó "messages"
            snapshot.forEach((childSnapshot) => {
                const messageData = childSnapshot.val();
                const messageElement = document.createElement('div');
                messageElement.textContent = messageData.text;
                messagesContainer.appendChild(messageElement);
            });
        }
    });

    // Ouvir por mensagens FCM
    onMessage(messaging, (payload) => {
        const messageData = payload.data;
        const messageElement = document.createElement('div');
        messageElement.textContent = messageData.text;
        messagesContainer.appendChild(messageElement);
    });

    // Obter o token FCM
    getToken(messaging).then((currentToken) => {
        if (currentToken) {
            // Enviar o token para o servidor para salvar no Realtime Database
            // ...
        } else {
            // Mostrar uma mensagem de erro
            console.error('Erro ao obter o token FCM.');
        }
    });
});
