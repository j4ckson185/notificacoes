import { getAuth, signInWithEmailAndPassword } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const user = userCredential.user;
        console.log('Usuário logado:', user);

        // Redirecionar para a página específica com base no email
        if (email === 'jackson_division@hotmail.com') {
            window.location.href = 'jackson.html';
        } else {
            // Redirecionar para outra página ou mostrar uma mensagem de erro
            console.error('Email inválido ou página não encontrada.');
        }

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erro ao fazer login:', errorCode, errorMessage);
    }
});
