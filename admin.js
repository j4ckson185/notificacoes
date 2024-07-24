import { getDatabase, ref, set } from './firebase-config.js';

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const user = document.getElementById('userSelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        // Send message to Realtime Database
        set(ref(getDatabase(), `messages/${user}`), {
            text: message
        })
        .then(() => {
            console.log('Mensagem enviada com sucesso para o Realtime Database!');
            document.getElementById('messageInput').value = '';
        })
        .catch((error) => {
            console.error('Erro ao enviar a mensagem para o Realtime Database:', error);
        });
    }
});
