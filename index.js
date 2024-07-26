// Importar funções da Firebase SDK
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { firebaseConfig } from './firebase-config.js'; // Certifique-se de que a configuração do Firebase está exportada corretamente

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app); // Definindo a variável firebaseAuth corretamente

// Lidar com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        console.log('Usuário logado:', user);
        // Redirecionar para a página principal após o login
        window.location.href = 'principal.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Exibir mensagem de erro para o usuário
        alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
});
