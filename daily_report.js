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

form.addEventListener('input', () => {
    const deliveryCount = parseInt(document.getElementById('deliveryCount').value) || 0;
    const sameHouseCount = parseInt(document.getElementById('sameHouseCount').value) || 0;
    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;

    const totalAmount = deliveryCount - sameHouseCount - receivedAmount;
    totalAmountDiv.textContent = totalAmount.toFixed(2);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = ref(database, 'reports/' + userId + '/' + new Date().toISOString().split('T')[0]);

            const reportData = {
                name: document.getElementById('motoboyName').value,
                deliveryCount: parseInt(document.getElementById('deliveryCount').value),
                sameHouseCount: parseInt(document.getElementById('sameHouseCount').value),
                receivedAmount: parseFloat(document.getElementById('receivedAmount').value),
                pixKey: document.getElementById('pixKey').value,
                totalAmount: parseFloat(totalAmountDiv.textContent),
                paymentStatus: document.querySelector('input[name="status"]:checked').value
            };

            set(userRef, reportData).then(() => {
                alert('Relatório enviado com sucesso!');
                form.reset();
                totalAmountDiv.textContent = '0';
            }).catch((error) => {
                console.error('Erro ao enviar relatório:', error);
            });
        } else {
            console.error('Usuário não autenticado');
        }
    });
});
