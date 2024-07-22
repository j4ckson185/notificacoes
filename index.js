import { auth, signInWithEmailAndPassword, database, ref, set, messaging, getToken } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');

// Lógica de Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        loginForm.reset();
        const user = userCredential.user;
        saveTokenAndRedirect(user);
    } catch (error) {
        alert('Erro ao entrar: ' + error.message);
    }
});

async function saveTokenAndRedirect(user) {
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });
        if (currentToken) {
            console.log('Token FCM:', currentToken);
            await set(ref(database, 'tokens/' + user.uid), {
                token: currentToken
            });
            // Redirecionar com base no email
            const emailToPageMap = {
                'joaofmarcelino1@gmail.com': 'joaofelipe.html',
                'giovanni.silva18@gmail.com': 'geovane.html',
                'moises110723@gmail.com': 'moises.html',
                'felipeaugusto02001@gmail.com': 'felipeaugusto.html',
                'gurgel6901@icloud.com': 'pedro.html',
                'jackson_division@hotmail.com': 'jackson.html'
            };
            const redirectPage = emailToPageMap[user.email];
            if (redirectPage) {
                window.location.href = redirectPage;
            } else {
                alert('Página de destino não encontrada para o email: ' + user.email);
            }
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
}

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registrado com sucesso, escopo é:', registration.scope);
        }).catch((err) => {
            console.error('Falha ao registrar o Service Worker:', err);
        });
}
