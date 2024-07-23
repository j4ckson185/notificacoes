import { firestore, collection, getDocs } from './firebase-config.js';

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const motoboy = document.getElementById('motoboySelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        try {
            const tokensRef = collection(firestore, "tokens");
            const querySnapshot = await getDocs(tokensRef);
            let token = '';

            querySnapshot.forEach((doc) => {
                if (doc.data().userId === motoboy) {
                    token = doc.data().token;
                }
            });

            if (token) {
                console.log('Token encontrado para o motoboy:', token);
                const response = await fetch('https://cabana-8d55e.uc.r.appspot.com/send-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        message: message
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erro do servidor: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('Mensagem enviada com sucesso:', data);
                document.getElementById('messageInput').value = '';
            } else {
                console.error('Token não encontrado para o motoboy:', motoboy);
            }
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    }
});
