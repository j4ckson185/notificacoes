import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuração do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redireciona para mapa.html após login bem-sucedido
        window.location.href = 'mapa.html';
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

// Tenta manter o usuário logado ao carregar a página
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'mapa.html';
    }
});
