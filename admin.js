import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
            if (doc.data().email === motoboy) {
                token = doc.data().token;
            }
        });

        if (token) {
            fetch('/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    message: message
                })
            })
            .then(response => {
                console.log('Resposta completa do servidor:', response);
                if (!response.ok) {
                    throw new Error(`Erro do servidor: ${response.statusText}`);
                }
                return response.json();  // Parse response as JSON
            })
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
