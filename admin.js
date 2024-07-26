// admin.js
import { database, ref, push } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Verifique a existência dos elementos DOM
    const sendMessageForm = document.getElementById('sendMessageForm');
    const userSelect = document.getElementById('userSelect');
    const messageInput = document.getElementById('messageInput');

    // Verifique se todos os elementos foram encontrados
    if (!sendMessageForm || !userSelect || !messageInput) {
        console.error('Um ou mais elementos não foram encontrados no DOM.');
        console.log('sendMessageForm:', sendMessageForm);
        console.log('userSelect:', userSelect);
        console.log('messageInput:', messageInput);
        return;
    }

    // Adicione o event listener ao formulário
    sendMessageForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const user = userSelect.value;
        const message = messageInput.value;

        if (message) {
            // Enviar mensagem para o Realtime Database
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
