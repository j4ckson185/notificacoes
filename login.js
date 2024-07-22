import { auth, signInWithEmailAndPassword } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Redirecionar com base no email
            switch(email) {
                case 'joaofmarcelino1@gmail.com':
                    window.location.href = 'joaofelipe.html';
                    break;
                case 'giovanni.silva18@gmail.com':
                    window.location.href = 'geovane.html';
                    break;
                case 'moises110723@gmail.com':
                    window.location.href = 'moises.html';
                    break;
                case 'felipeaugusto02001@gmail.com':
                    window.location.href = 'felipeaugusto.html';
                    break;
                case 'gurgel6901@icloud.com':
                    window.location.href = 'pedro.html';
                    break;
                case 'jackson_division@hotmail.com':
                    window.location.href = 'jackson.html';
                    break;
                default:
                    alert('Email não reconhecido');
            }
        })
        .catch((error) => {
            alert('Erro ao entrar: ' + error.message);
        });
});
