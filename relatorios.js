import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, get, query, orderByChild, startAt, endAt, equalTo } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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
const database = getDatabase(app);

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === '@Saberviagens123') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('reportSection').style.display = 'block';
    } else {
        alert('Senha incorreta!');
    }
});

document.getElementById('fetchReport').addEventListener('click', async (e) => {
    e.preventDefault();
    const motoboyEmail = document.getElementById('motoboySelect').value;
    const date = document.getElementById('dateSelect').value;

    if (motoboyEmail && date) {
        const sanitizedEmail = sanitizeEmail(motoboyEmail);
        const reportRef = query(ref(database, `reports/${sanitizedEmail}`), orderByChild('date'), equalTo(date));
        const snapshot = await get(reportRef);

        if (snapshot.exists()) {
            const reports = snapshot.val();
            const reportData = Object.values(reports)[0]; // Considering the first match

            document.getElementById('displayMotoboyName').textContent = reportData.name;
            document.getElementById('displayDate').textContent = reportData.date;
            document.getElementById('displayDeliveryCount').textContent = reportData.deliveryCount;
            document.getElementById('displaySameHouseCount').textContent = reportData.sameHouseCount;
            document.getElementById('displayReceivedAmount').textContent = reportData.receivedAmount.toFixed(2);
            document.getElementById('displayPixKey').textContent = reportData.pixKey;
            document.getElementById('displayTotalAmount').textContent = reportData.totalAmount.toFixed(2);
            document.getElementById('displayPaymentStatus').textContent = reportData.paymentStatus;

            document.getElementById('reportDisplay').style.display = 'block';
        } else {
            alert('Relatório não encontrado para este motoboy e data.');
        }
    } else {
        alert('Por favor, selecione um motoboy e uma data.');
    }
});

function sanitizeEmail(email) {
    return email.replace(/[\.\#\$\[\]]/g, '_');
}
