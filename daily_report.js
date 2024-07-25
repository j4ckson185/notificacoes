import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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
const reportDisplay = document.getElementById('reportDisplay');

const nameMap = {
    'boazd3@gmail.com': 'Boaz',
    'fellipeirineu90@gmail.com': 'Fellipe Matheus',
    'giovanni.silva18@gmail.com': 'Giovanni',
    'moises110723@gmail.com': 'Moisés',
    'jackson_division@hotmail.com': 'Jackson Maciel'
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userEmail = user.email;
        document.getElementById('motoboyName').value = nameMap[userEmail] || 'Usuário';
    } else {
        console.error('Usuário não autenticado');
    }
});

form.addEventListener('input', () => {
    const deliveryCount = parseInt(document.getElementById('deliveryCount').value) || 0;
    const sameHouseCount = parseInt(document.getElementById('sameHouseCount').value) || 0;
    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;

    const totalAmount = deliveryCount - sameHouseCount - receivedAmount;
    totalAmountDiv.textContent = totalAmount.toFixed(2);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const reportData = {
        name: document.getElementById('motoboyName').value,
        dayOfWeek: document.getElementById('dayOfWeek').value,
        deliveryCount: parseInt(document.getElementById('deliveryCount').value),
        sameHouseCount: parseInt(document.getElementById('sameHouseCount').value),
        receivedAmount: parseFloat(document.getElementById('receivedAmount').value),
        pixKey: document.getElementById('pixKey').value,
        totalAmount: parseFloat(totalAmountDiv.textContent),
        paymentStatus: document.getElementById('paymentStatus').value
    };

    document.getElementById('displayMotoboyName').textContent = reportData.name;
    document.getElementById('displayDayOfWeek').textContent = reportData.dayOfWeek;
    document.getElementById('displayDeliveryCount').textContent = reportData.deliveryCount;
    document.getElementById('displaySameHouseCount').textContent = reportData.sameHouseCount;
    document.getElementById('displayReceivedAmount').textContent = reportData.receivedAmount.toFixed(2);
    document.getElementById('displayPixKey').textContent = reportData.pixKey;
    document.getElementById('displayTotalAmount').textContent = reportData.totalAmount.toFixed(2);
    document.getElementById('displayPaymentStatus').textContent = reportData.paymentStatus;

    reportDisplay.style.display = 'block';
});
