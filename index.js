import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const token = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });

            await addDoc(collection(db, "tokens"), {
                uid: user.uid,
                token: token
            });

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
                    alert('Login bem-sucedido, mas o redirecionamento falhou.');
            }
        })
        .catch((error) => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Por favor, tente novamente.');
        });
});
