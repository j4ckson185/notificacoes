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
                    console.log('Atualizando localização:', newLocation); // Log para depuração
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
                enableHighAccuracy: true, // Melhora a precisão da localização
                timeout: 5000,            // Tempo máximo para obter a localização
                maximumAge: 1000         // Máxima idade da localização para ser considerada válida
            }
        );
    } else {
        console.error('Geolocalização não é suportada pelo navegador.');
    }
}

// Chama a função quando o usuário faz login
auth.onAuthStateChanged((user) => {
    if (user) {
        // Inicia a atualização da localização em tempo real
        setInterval(updateLocation, 5000); // Atualiza a cada 5 segundos
    }
});
