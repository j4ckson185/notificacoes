import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, push, set, onValue, update, get } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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

const form = document.getElementById('dailyReportForm');
const totalAmountDiv = document.getElementById('totalAmount');
const confirmationMessage = document.getElementById('confirmationMessage');
const reportsList = document.getElementById('reportsList');
const reportsContainer = document.getElementById('reportsContainer');
const reportDisplay = document.getElementById('reportDisplay');

const nameMap = {
    'boazd3@gmail.com': 'Boaz',
    'fellipeirineu90@gmail.com': 'Fellipe Matheus',
    'giovanni.silva18@gmail.com': 'Giovanni',
    'moises110723@gmail.com': 'Moisés',
    'jackson_division@hotmail.com': 'Jackson Maciel'
};

let currentUserEmail = '';

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserEmail = user.email;
        document.getElementById('motoboyName').value = nameMap[user.email] || 'Usuário';
    } else {
        console.error('Usuário não autenticado');
    }
});

function populateSelectOptions() {
    const deliveryCountSelect = document.getElementById('deliveryCount');
    const sameHouseCountSelect = document.getElementById('sameHouseCount');

    for (let i = 1; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        deliveryCountSelect.appendChild(option);
    }

    for (let i = 0; i <= 15; i++) { // Incluir 0 também
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        sameHouseCountSelect.appendChild(option);
    }
}

populateSelectOptions();

form.addEventListener('input', () => {
    const deliveryCount = parseInt(document.getElementById('deliveryCount').value) || 0;
    const sameHouseCount = parseInt(document.getElementById('sameHouseCount').value) || 0;
    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;
    const shiftValue = parseFloat(document.getElementById('shiftType').value) || 0;

    const totalAmount = (deliveryCount * 3) - (sameHouseCount * 3) - receivedAmount + shiftValue;
    totalAmountDiv.textContent = totalAmount.toFixed(2);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const reportData = {
        name: document.getElementById('motoboyName').value,
        dayOfWeek: document.getElementById('dayOfWeek').value,
        deliveryCount: document.getElementById('deliveryCount').value,
        sameHouseCount: document.getElementById('sameHouseCount').value,
        receivedAmount: parseFloat(document.getElementById('receivedAmount').value),
        pixKey: document.getElementById('pixKey').value,
        totalAmount: parseFloat(totalAmountDiv.textContent),
        paymentStatus: document.getElementById('paymentStatus').value
    };

    const encodedEmail = encodeURIComponent(currentUserEmail);
    const reportRef = ref(database, `reports/${encodedEmail}`);
    push(reportRef, reportData)
        .then(() => {
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao enviar relatório:', error);
        });
});

document.getElementById('viewReports').addEventListener('click', () => {
    confirmationMessage.style.display = 'none';
    reportsList.style.display = 'block';
    loadReports();
});

document.getElementById('addNewReport').addEventListener('click', () => {
    location.reload();
});

document.getElementById('backToForm').addEventListener('click', () => {
    reportsList.style.display = 'none';
    form.style.display = 'block';
});

function loadReports() {
    reportsContainer.innerHTML = '';
    const encodedEmail = encodeURIComponent(currentUserEmail);
    const reportsRef = ref(database, `reports/${encodedEmail}`);
    onValue(reportsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const reportData = childSnapshot.val();
            const reportKey = childSnapshot.key;

            const reportDiv = document.createElement('div');
            reportDiv.classList.add('report');

            reportDiv.innerHTML = `
                <p><strong>Nome:</strong> ${reportData.name}</p>
                <p><strong>Dia da Semana:</strong> ${reportData.dayOfWeek}</p>
                <p><strong>Quantidade de Entregas:</strong> ${reportData.deliveryCount}</p>
                <p><strong>Entregas na mesma casa:</strong> ${reportData.sameHouseCount}</p>
                <p><strong>Valor dentro (já recebido):</strong> ${reportData.receivedAmount.toFixed(2)}</p>
                <p><strong>PIX:</strong> ${reportData.pixKey}</p>
                <p><strong>Total a Receber:</strong> ${reportData.totalAmount.toFixed(2)}</p>
                <p><strong>Status do Pagamento:</strong> ${reportData.paymentStatus}</p>
                <button class="editReport" data-key="${reportKey}">Editar Formulário</button>
            `;

            reportsContainer.appendChild(reportDiv);
        });

        document.querySelectorAll('.editReport').forEach((button) => {
            button.addEventListener('click', (e) => {
                const reportKey = e.target.getAttribute('data-key');
                editReport(reportKey);
            });
        });
    });
}

function editReport(reportKey) {
    const encodedEmail = encodeURIComponent(currentUserEmail);
    const reportRef = ref(database, `reports/${encodedEmail}/${reportKey}`);
    get(reportRef).then((snapshot) => {
        if (snapshot.exists()) {
            const reportData = snapshot.val();

            document.getElementById('motoboyName').value = reportData.name;
            document.getElementById('dayOfWeek').value = reportData.dayOfWeek;
            document.getElementById('deliveryCount').value = reportData.deliveryCount;
            document.getElementById('sameHouseCount').value = reportData.sameHouseCount;
            document.getElementById('receivedAmount').value = reportData.receivedAmount;
            document.getElementById('pixKey').value = reportData.pixKey;
            document.getElementById('totalAmount').textContent = reportData.totalAmount.toFixed(2);
            document.getElementById('paymentStatus').value = reportData.paymentStatus;

            form.removeEventListener('submit', submitNewReport);
            form.addEventListener('submit', (e) => updateReport(e, reportKey));

            form.style.display = 'block';
            reportsList.style.display = 'none';
        } else {
            console.error('Relatório não encontrado');
        }
    }).catch((error) => {
        console.error('Erro ao buscar relatório:', error);
    });
}

function updateReport(e, reportKey) {
    e.preventDefault();

    const reportData = {
        name: document.getElementById('motoboyName').value,
        dayOfWeek: document.getElementById('dayOfWeek').value,
        deliveryCount: document.getElementById('deliveryCount').value,
        sameHouseCount: document.getElementById('sameHouseCount').value,
        receivedAmount: parseFloat(document.getElementById('receivedAmount').value),
        pixKey: document.getElementById('pixKey').value,
        totalAmount: parseFloat(totalAmountDiv.textContent),
        paymentStatus: document.getElementById('paymentStatus').value
    };

    const encodedEmail = encodeURIComponent(currentUserEmail);
    const reportRef = ref(database, `reports/${encodedEmail}/${reportKey}`);
    update(reportRef, reportData)
        .then(() => {
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao atualizar relatório:', error);
        });
}

function submitNewReport(e) {
    e.preventDefault();

    const reportData = {
        name: document.getElementById('motoboyName').value,
        dayOfWeek: document.getElementById('dayOfWeek').value,
        deliveryCount: document.getElementById('deliveryCount').value,
        sameHouseCount: document.getElementById('sameHouseCount').value,
        receivedAmount: parseFloat(document.getElementById('receivedAmount').value),
        pixKey: document.getElementById('pixKey').value,
        totalAmount: parseFloat(totalAmountDiv.textContent),
        paymentStatus: document.getElementById('paymentStatus').value
    };

    const encodedEmail = encodeURIComponent(currentUserEmail);
    const reportRef = ref(database, `reports/${encodedEmail}`);
    push(reportRef, reportData)
        .then(() => {
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao enviar relatório:', error);
        });
}
