// daily_report.js
import { auth, database, ref, push, onValue } from './firebase-config.js';

// Mapear emails para nomes
const emailToNameMap = {
    'jackson_division@hotmail.com': 'Jackson Maciel',
    'giovanni.silva18@gmail.com': 'Giovanni',
    'felipeaugusto02001@gmail.com': 'Felipe Augusto',
    'hionarabeatriz11@gmail.com': 'Hionara',
    'moises110723@gmail.com': 'Moisés',
    'boazd3@gmail.com': 'Boaz',
    'fellipeirineu90@gmail.com': 'Fellipe Matheus'
};

// Função para preencher o nome do usuário autenticado
function setUserName() {
    const user = auth.currentUser;
    if (user) {
        const email = user.email;
        const userName = emailToNameMap[email] || 'Usuário';
        document.getElementById('name').value = userName;
    }
}

// Função para preencher as opções de seleção com números inteiros
function populateSelectOptions(selectElement, start, end) {
    for (let i = start; i <= end; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectElement.appendChild(option);
    }
}

// Preencher as opções de seleção
document.addEventListener('DOMContentLoaded', () => {
    const deliveriesSelect = document.getElementById('deliveries');
    const sameHouseDeliveriesSelect = document.getElementById('sameHouseDeliveries');
    populateSelectOptions(deliveriesSelect, 1, 100);
    populateSelectOptions(sameHouseDeliveriesSelect, 0, 15);
    setUserName();
});

// Adicionar evento de envio do formulário
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

// Função para exibir relatórios
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

// Carregar relatórios ao inicializar a página e definir o nome do usuário
auth.onAuthStateChanged((user) => {
    if (user) {
        setUserName();
        displayReports(user.uid);
    }
});
