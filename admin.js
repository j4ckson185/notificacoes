import { app, firestore, collection, getDocs } from './firebase-config.js';

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const motoboy = document.getElementById('motoboySelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        const tokensRef = collection(firestore, "tokens");
        const querySnapshot = await getDocs(tokensRef);
        let token = '';

        querySnapshot.forEach((doc) => {
            if (doc.id === motoboy) {
                token = doc.data().token;
            }
        });

        if (token) {
            fetch('https://cabana-8d55e.uc.r.appspot.com/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Mensagem enviada com sucesso:', data);
                document.getElementById('messageInput').value = '';
            })
            .catch((error) => {
                console.error('Erro ao enviar a mensagem:', error);
            });
        } else {
            console.error('Token não encontrado para o motoboy:', motoboy);
        }
    }
});
