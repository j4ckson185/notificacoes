import { auth, database, ref, set } from './firebase-config.js';

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
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.error('Geolocalização não é suportada pelo navegador.');
    }
}

// Call the function when the user logs in
auth.onAuthStateChanged((user) => {
    if (user) {
        updateLocation();
    }
});
