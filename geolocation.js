// geolocation.js
function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const user = firebase.auth().currentUser;
            if (user) {
                const userId = user.uid;
                const userRef = firebase.database().ref('locations/' + userId);
                userRef.set({
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
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updateLocation();
    }
});
