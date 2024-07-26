// daily_report.js
import { auth, database, ref, push, onValue } from './firebase-config.js';

document.getElementById('dailyReportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        console.error('Usuário não está autenticado');
        return;
    }

    const reportData = {
        name: document.getElementById('name').value,
        deliveries: document.getElementById('deliveries').value,
        sameHouseDeliveries: document.getElementById('sameHouseDeliveries').value,
        amountReceived: document.getElementById('amountReceived').value,
        totalAmountPending: document.getElementById('totalAmountPending').value,
        pix: document.getElementById('pix').value,
        status: document.getElementById('status').value,
        date: document.getElementById('date').value,
        timestamp: new Date().toISOString()
    };

    try {
        const reportsRef = ref(database, 'reports/' + user.uid);
        await push(reportsRef, reportData);
        alert('Relatório enviado com sucesso');
        displayReports(user.uid);
    } catch (error) {
        console.error('Erro ao enviar relatório:', error);
    }
});

async function displayReports(userId) {
    const reportsRef = ref(database, 'reports/' + userId);
    onValue(reportsRef, (snapshot) => {
        const reportsContainer = document.getElementById('reportsContainer');
        reportsContainer.innerHTML = ''; // Limpa os relatórios antigos
        snapshot.forEach((childSnapshot) => {
            const report = childSnapshot.val();
            const reportElement = document.createElement('div');
            reportElement.innerHTML = `
                <p>Nome: ${report.name}</p>
                <p>Quantidade de Entregas: ${report.deliveries}</p>
                <p>Entregas na Mesma Casa: ${report.sameHouseDeliveries}</p>
                <p>Valor Recebido: ${report.amountReceived}</p>
                <p>Valor Total Pendente: ${report.totalAmountPending}</p>
                <p>Pix: ${report.pix}</p>
                <p>Status: ${report.status}</p>
                <p>Data: ${report.date}</p>
                <p>Timestamp: ${report.timestamp}</p>
                <button onclick="editReport('${childSnapshot.key}')">Editar</button>
                <button onclick="deleteReport('${childSnapshot.key}')">Remover</button>
            `;
            reportsContainer.appendChild(reportElement);
        });
    });
}

window.editReport = function(reportId) {
    // Lógica para editar o relatório
};

window.deleteReport = function(reportId) {
    const user = auth.currentUser;
    if (!user) {
        console.error('Usuário não está autenticado');
        return;
    }
    const reportRef = ref(database, 'reports/' + user.uid + '/' + reportId);
    set(reportRef, null)
        .then(() => {
            alert('Relatório removido com sucesso');
            displayReports(user.uid);
        })
        .catch((error) => {
            console.error('Erro ao remover relatório:', error);
        });
};

// Carrega os relatórios ao inicializar a página
auth.onAuthStateChanged((user) => {
    if (user) {
        displayReports(user.uid);
    }
});
