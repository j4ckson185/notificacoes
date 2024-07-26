import { firebaseAuth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// Lidar com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        console.log('Usuário logado:', user);
        // Redirecionar para a página principal após o login
        window.location.href = 'mapa.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Exibir mensagem de erro para o usuário
        alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
});
