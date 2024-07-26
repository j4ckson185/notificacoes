import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, push, set, onValue, update, get, query, orderByChild, startAt, endAt } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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

function sanitizeEmail(email) {
    return email.replace(/[\.\#\$\[\]]/g, '_');
}

function populateSelectOptions() {
    const deliveryCountSelect = document.getElementById('deliveryCount');
    const sameHouseCountSelect = document.getElementById('sameHouseCount');

    for (let i = 1; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        deliveryCountSelect.appendChild(option);
    }

    for (let i = 0; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        sameHouseCountSelect.appendChild(option);
    }
}

populateSelectOptions();

document.getElementById('date').addEventListener('change', () => {
    const date = new Date(document.getElementById('date').value);
    const options = { weekday: 'long', timeZone: 'America/Sao_Paulo' }; // Set timezone to Brazil
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', options).format(date);
    document.getElementById('dayOfWeek').value = dayOfWeek;
});

form.addEventListener('input', () => {
    const deliveryCount = parseInt(document.getElementById('deliveryCount').value) || 0;
    const sameHouseCount = parseInt(document.getElementById('sameHouseCount').value) || 0;
    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;
    const shiftValue = parseFloat(document.getElementById('shiftType').value) || 0;

    let totalAmount
