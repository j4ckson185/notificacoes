// geolocation.js
import { auth, database, ref } from './firebase-config.js';

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const userRef = ref(database, 'locations/' + userId);
                set(userRef, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }
        }, (error) => {
            console.error('Erro ao obter localização:', error);
        });
    } else {
        console.error('Geolocalização não é suportada pelo navegador.');
    }
}

// Chamar a função após o login do usuário
auth.onAuthStateChanged((user) => {
    if (user) {
        updateLocation();
    }
});
