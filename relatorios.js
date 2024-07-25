import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    measurementId: "G-96Y337GYT8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Erro ao sair da conta:', error);
        });
});

document.getElementById('applyFilter').addEventListener('click', async () => {
    const email = document.getElementById('motoboyName').value;
    const filterDate = document.getElementById('reportDate').value;

    if (email && filterDate) {
        try {
            const sanitizedEmail = sanitizeEmail(email);
            const reportsRef = ref(database, `reports/${sanitizedEmail}`);
            const startDate = new Date(filterDate);
            const endDate = new Date(filterDate);
            endDate.setDate(endDate.getDate() + 1);

            const startDateString = startDate.toISOString().split('T')[0];
            const endDateString = endDate.toISOString().split('T')[0];

            const filteredReportsQuery = query(reportsRef, orderByChild('date'), startAt(startDateString), endAt(endDateString));
            const snapshot = await get(filteredReportsQuery);

            const reportsContainer = document.getElementById('reportsContainer');
            reportsContainer.innerHTML = '';

            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const reportData = childSnapshot.val();
                    const reportKey = childSnapshot.key;

                    const reportDiv = document.createElement('div');
                    reportDiv.classList.add('report');

                    reportDiv.innerHTML = `
                        <p><strong>Nome:</strong> ${reportData.name}</p>
                        <p><strong>Data:</strong> ${reportData.date}</p>
                        <p><strong>Quantidade de Entregas:</strong> ${reportData.deliveryCount}</p>
                        <p><strong>Entregas na mesma casa:</strong> ${reportData.sameHouseCount}</p>
                        <p><strong>Valor dentro (já recebido):</strong> ${reportData.receivedAmount.toFixed(2)}</p>
                        <p><strong>PIX:</strong> ${reportData.pixKey}</p>
                        <p><strong>Total a Receber:</strong> ${reportData.totalAmount.toFixed(2)}</p>
                        <p><strong>Status do Pagamento:</strong> ${reportData.paymentStatus}</p>
                        <button class="deleteReport" data-key="${reportKey}">Remover Relatório</button>
                    `;

                    reportsContainer.appendChild(reportDiv);
                });

                document.querySelectorAll('.deleteReport').forEach((button) => {
                    button.addEventListener('click', async (e) => {
                        const reportKey = e.target.getAttribute('data-key');
                        const sanitizedEmail = sanitizeEmail(email);
                        const reportRef = ref(database, `reports/${sanitizedEmail}/${reportKey}`);
                        try {
                            await remove(reportRef);
                            e.target.parentElement.remove();
                        } catch (error) {
                            console.error('Erro ao remover relatório:', error);
                        }
                    });
                });
            } else {
                reportsContainer.innerHTML = '<p>Nenhum relatório encontrado para a data selecionada.</p>';
            }
        } catch (error) {
            console.error('Erro ao buscar relatórios:', error);
        }
    } else {
        alert('Por favor, selecione um nome e uma data.');
    }
});

function sanitizeEmail(email) {
    return email.replace(/[\.\#\$\[\]]/g, '_');
}
