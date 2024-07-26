// daily_report.js
document.addEventListener('DOMContentLoaded', () => {
    const auth = window.firebaseAuth;
    const database = window.firebaseDatabase;

    auth.onAuthStateChanged(user => {
        if (user) {
            // Preencha o campo "Nome" automaticamente com base no email do usuário
            const nameField = document.getElementById('name');
            const email = user.email;
            const nameMap = {
                'jackson_division@hotmail.com': 'Jackson Maciel',
                'giovanni.silva18@gmail.com': 'Giovanni',
                'felipeaugusto02001@gmail.com': 'Felipe Augusto',
                'hionarabeatriz11@gmail.com': 'Hionara',
                'moises110723@gmail.com': 'Moisés',
                'boazd3@gmail.com': 'Boaz',
                'fellipeirineu90@gmail.com': 'Fellipe Matheus'
            };
            nameField.value = nameMap[email] || '';

            // Adicionar event listener ao formulário
            document.getElementById('reportForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const date = document.getElementById('date').value;
                const deliveries = document.getElementById('deliveries').value;
                const sameHouseDeliveries = document.getElementById('sameHouseDeliveries').value;
                const amountReceived = document.getElementById('amountReceived').value;
                const pix = document.getElementById('pix').value;
                const shift = document.getElementById('shift').value;

                // Calcular valor total a receber
                const totalAmountToReceive = (deliveries * 3) - (sameHouseDeliveries * 3) - amountReceived + parseFloat(shift);

                const reportData = {
                    name: nameField.value,
                    deliveries,
                    sameHouseDeliveries,
                    amountReceived,
                    pix,
                    status: 'Pendente',
                    date,
                    shift,
                    totalAmountToReceive,
                    timestamp: new Date().toISOString()
                };

                try {
                    await database.ref('reports/' + email.replace(/\./g, '_')).push(reportData);
                    alert('Relatório enviado com sucesso!');
                } catch (error) {
                    console.error('Erro ao enviar relatório:', error);
                    alert('Erro ao enviar relatório: ' + error.message);
                }
            });
        } else {
            console.log('Nenhum usuário autenticado');
        }
    });
});
