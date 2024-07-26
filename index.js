// index.js
import { auth, messaging, database, ref, set, getToken, signInWithEmailAndPassword, onAuthStateChanged } from './firebase-config.js';

// Verificar se o usuário está autenticado ao carregar a página
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está autenticado, redirecionar para a página específica
        const email = user.email;
        window.location.href = emailToPage(email);
    }
});

// Função para redirecionar com base no email
function emailToPage(email) {
    const emailMap = {
        'jackson_division@hotmail.com': 'jackson.html',
        'giovanni.silva18@gmail.com': 'geovane.html',
        'felipeaugusto02001@gmail.com': 'felipeaugusto.html',
        'hionarabeatriz11@gmail.com': 'hionara.html',
        'moises110723@gmail.com': 'moises.html',
        'boazd3@gmail.com': 'boaz.html',
        'fellipeirineu90@gmail.com': 'fellipematheus.html'
    };
    return emailMap[email] || 'index.html'; // Default to index.html if no match
}

// Evento de envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Solicitar permissão para geolocalização
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userId = user.uid;
                const userRef = ref(database, 'locations/' + userId);
                set(userRef, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.error('Erro ao obter localização:', error);
            });

            navigator.geolocation.watchPosition((position) => {
                const userId = user.uid;
                const userRef = ref(database, 'locations/' + userId);
                set(userRef, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.error('Erro ao atualizar localização:', error);
            });
        } else {
            console.error('Geolocalização não é suportada pelo navegador.');
        }

        // Obter o token FCM
        const currentToken = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' }); // Replace with your actual VAPID key
        if (currentToken) {
            // Salvar o token no banco de dados
            await set(ref(database, 'tokens/' + user.uid), {
                token: currentToken
            });

            // Redirecionar para a página específica
            window.location.href = emailToPage(email);
        } else {
            console.log('No registration token available.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

// Registrar service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(err => {
            console.error('Error registering Service Worker:', err);
        });
}
