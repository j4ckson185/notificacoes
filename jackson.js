import { getDatabase, ref, onValue, getMessaging, getToken, onMessage, getAuth, signInWithEmailAndPassword } from './firebase-config.js';

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

// Ouvir por mensagens FCM
const messaging = getMessaging();
onMessage(messaging, (payload) => {
  const messageData = payload.data;
  const messageElement = document.createElement('div');
  messageElement.textContent = messageData.text;
  messagesContainer.appendChild(messageElement);

  // Reproduzir o som personalizado
  const audio = new Audio('assets/notification.mp3');
  audio.play();
});

// Listen for token refresh events
messaging.onTokenRefresh(() => {
  getToken(messaging).then((newToken) => {
    if (newToken) {
      // Send the new token to your server to update in the database
      console.log('Token refreshed:', newToken);
      // ... send newToken to your server
    } else {
      // Show an error message
      console.error('Error refreshing token.');
    }
  });
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
    }).catch((error) => {
  if (error.code === 'messaging/token-unsubscribe-failed') {
    // Try to get a new token or ignore the error
    console.error('Error unsubscribing from FCM:', error);
  } else {
    console.error('Error getting FCM token:', error);
  }
});
