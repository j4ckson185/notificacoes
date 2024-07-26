import { auth, database, ref, set } from './firebase-config.js';

function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    const userRef = ref(database, 'locations/' + userId);
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('Atualizando localização:', newLocation); // Log de depuração
                    set(userRef, newLocation)
                        .then(() => {
                            console.log('Localização atualizada no Firebase');
                        })
                        .catch((error) => {
                            console.error('Erro ao atualizar localização:', error);
                        });
                }
            },
            (error) => {
                console.error('Erro ao obter localização:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 1000
            }
        );
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
