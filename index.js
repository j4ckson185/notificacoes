import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Import Firebase services from firebase-config.js
import { auth, messaging, database } from './firebase-config.js';

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

        // Get FCM token
        const currentToken = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' }); // Replace with your actual VAPID key
        if (currentToken) {
            // Save token to database
            await set(ref(database, 'tokens/' + user.uid), {
                token: currentToken
            });

            // Redirect to the specific page
            window.location.href = emailToPage(email);
        } else {
            console.log('No registration token available.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

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

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(err => {
            console.error('Error registering Service Worker:', err);
        });
}

// Handle user authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
});
