// admin.js
import { database } from './firebase-config.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const sendMessageForm = document.getElementById('sendMessageForm');
    const userSelect = document.getElementById('userSelect');
    const messageInput = document.getElementById('messageInput');

    console.log('Iniciando admin.js');
    console.log('sendMessageForm:', sendMessageForm);
    console.log('userSelect:', userSelect);
    console.log('messageInput:', messageInput);

    if (!sendMessageForm || !userSelect || !messageInput) {
        console.error('Um ou mais elementos não foram encontrados no DOM.');
        return;
    }

    sendMessageForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const user = userSelect.value;
        const message = messageInput.value;

        if (message) {
            // Envia a mensagem para o Realtime Database
            push(ref(database, `messages/${user}`), {
                text: message
            })
            .then(() => {
                console.log('Mensagem enviada com sucesso para o Realtime Database!');
                messageInput.value = '';
            })
            .catch((error) => {
                console.error('Erro ao enviar a mensagem para o Realtime Database:', error);
            });
        }
    });
});
