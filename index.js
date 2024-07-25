// index.js
import { auth, database, ref, set, signInWithEmailAndPassword } from './firebase-config.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Solicitar permissão para geolocalização
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                const userId = user.uid;
                const userRef = ref(database, 'locations/' + userId);
                set(userRef, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    email: user.email // Armazenar o e-mail do usuário
                });
            }, (error) => {
                console.error('Erro ao obter localização:', error);
            });
        } else {
            console.error('Geolocalização não é suportada pelo navegador.');
        }

        // Redirecionar para a página do mapa
        window.location.href = 'mapa.html';
    } catch (error) {
        console.error('Error signing in:', error);
    }
});
