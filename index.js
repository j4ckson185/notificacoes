// index.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Substitua pelas configurações do seu projeto Firebase
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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha uma referência para o serviço de autenticação
const auth = getAuth(app);

// Manipule o formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Crie um novo usuário com email e senha
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuário registrado com sucesso!');
        // Redirecione para a próxima página (por exemplo, o painel administrativo)
        // window.location.href = 'admin.html';
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
    }
});
