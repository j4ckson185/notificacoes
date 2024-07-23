import { getDatabase, ref, onChildAdded } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');

// Referência para o nó "messages" no Realtime Database
const messagesRef = ref(getDatabase(), 'messages');

// Ouvir por novas mensagens adicionadas
onChildAdded(messagesRef, (snapshot) => {
    const messageData = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messagesContainer.appendChild(messageElement);
});
