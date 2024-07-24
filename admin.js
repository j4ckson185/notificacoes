import { getDatabase, ref } from './firebase-config.js';
import { push } from './firebase-config.js';

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const user = document.getElementById('userSelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        // Enviar mensagem para o Realtime Database
        const db = getDatabase();
        push(ref(db, `messages/${user}`), {
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
