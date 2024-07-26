import { getAuth, signInWithEmailAndPassword } from './firebase-config.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const auth = getAuth();
const database = getDatabase();

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            startTrackingLocation(user.uid);
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
});

function startTrackingLocation(userId) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Atualizar a localização do usuário no Firebase
                set(ref(database, 'locations/' + userId), {
                    lat: pos.lat,
                    lng: pos.lng,
                    name: userId // Ou qualquer identificador que você queira usar
                });

            },
            (error) => {
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000
            }
        );
    } else {
        console.error('Geolocation not supported.');
    }
}
