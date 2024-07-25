import { database, ref, onValue, auth } from './firebase-config.js';

let map;
let markers = [];

// Inicializa o mapa e carrega as localizações
window.initMap = function() {
    const storeLocation = { lat: -5.748178, lng: -35.256141 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: storeLocation,
        zoom: 15
    });

    // Adicionar localização própria do usuário
    if (auth.currentUser) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    url: 'https://i.ibb.co/FHdgjcK/capacete.png',
                    scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone ajustado
                },
                title: 'Sua Localização'
            });
            map.setCenter(userLocation);
        }, (error) => {
            console.error('Erro ao obter localização do usuário:', error);
        });
    }

    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        const locations = snapshot.val();
        if (locations) {
            clearMarkers();
            for (const key in locations) {
                const location = locations[key];
                addUserMarker(location, key);
            }
        }
    });
};

function addUserMarker(location, userId) {
    const userRef = ref(database, 'users/' + userId); // Assume que os dados dos usuários estão armazenados na árvore 'users'
    onValue(userRef, (snapshot) => {
        const user = snapshot.val();
        const nameOrEmail = user ? (user.name || user.email || 'Usuário') : 'Usuário Desconhecido';
        const address = location.address || 'Endereço não disponível';

        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            icon: {
                url: 'https://i.ibb.co/FHdgjcK/capacete.png',
                scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone ajustado
            },
            title: `${nameOrEmail}\n${address}`
        });

        const infowindow = new google.maps.InfoWindow({
            content: `${nameOrEmail}<br>${address}`
        });

        marker.addListener('mouseover', () => {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
            infowindow.close();
        });

        markers.push(marker);
    }, (error) => {
        console.error('Erro ao obter informações do usuário:', error);
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}
