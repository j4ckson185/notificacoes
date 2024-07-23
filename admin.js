import { firestore, collection, getDocs, getDatabase, ref, set } from './firebase-config.js';

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const motoboy = document.getElementById('motoboySelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        const tokensRef = collection(firestore, "tokens");
        const querySnapshot = await getDocs(tokensRef);
        let token = '';

        querySnapshot.forEach((doc) => {
            if (doc.data().uid === motoboy) {
                token = doc.data().token;
            }
        });

        if (token) {
            // Send message to Realtime Database
            set(ref(getDatabase(), `messages/${motoboy}`), {
                text: message
            })
            .then(() => {
                console.log('Mensagem enviada com sucesso para o Realtime Database!');
                document.getElementById('messageInput').value = '';

                // Enviar notificação push usando FCM
fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' // Replace with your actual server key
    },
                    body: JSON.stringify({
                        to: token,
                        notification: {
                            title: 'Nova Mensagem',
                            body: message,
                            sound: 'notification.mp3'
                        }
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro do servidor: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Mensagem enviada com sucesso:', data);
                })
                .catch((error) => {
                    console.error('Erro ao enviar a mensagem:', error);
                });
            })
            .catch((error) => {
                console.error('Erro ao enviar a mensagem para o Realtime Database:', error);
            });
        } else {
            console.error('Token não encontrado para o motoboy:', motoboy);
        }
    }
});
