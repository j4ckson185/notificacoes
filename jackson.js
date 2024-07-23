import { getDatabase, ref, onValue } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');

// Referência para o nó "messages" no Realtime Database
const messagesRef = ref(getDatabase(), 'messages');

// Ouvir por mudanças no nó "messages"
onValue(messagesRef, (snapshot) => {
    // Limpar o conteúdo do container de mensagens
    messagesContainer.innerHTML = '';

    // Iterar sobre os filhos do nó "messages"
    snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        const messageElement = document.createElement('div');
        messageElement.textContent = messageData.text;
        messagesContainer.appendChild(messageElement);
    });
});
