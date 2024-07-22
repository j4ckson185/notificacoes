import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { messaging } from './firebase-config.js';

const db = getFirestore();

document.getElementById('sendMessageForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const motoboy = document.getElementById('motoboySelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        const tokensRef = collection(db, "tokens");
        const querySnapshot = await getDocs(tokensRef);
        let token = '';

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            const motoboyEmailMap = {
                'jackson': 'jackson_division@hotmail.com',
                'geovane': 'giovanni.silva18@gmail.com',
                'moises': 'moises110723@gmail.com',
                'felipeaugusto': 'felipeaugusto02001@gmail.com',
                'pedro': 'gurgel6901@icloud.com'
            };

            if (docData.email === motoboyEmailMap[motoboy]) {
                token = docData.token;
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
