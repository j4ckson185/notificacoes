document.getElementById('sendMessageForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const motoboy = document.getElementById('motoboySelect').value;
    const message = document.getElementById('messageInput').value;

    if (message) {
        fetch('/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                motoboy: motoboy,
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
    }
});
