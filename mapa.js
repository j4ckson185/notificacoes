import { database, ref, onValue, set } from './firebase-config.js';

let map;
let markers = {};

// Inicializa o mapa e carrega as localizações
window.initMap = function() {
    const storeLocation = { lat: -5.748178, lng: -35.256141 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: storeLocation,
        zoom: 15
    });

    // Atualiza a localização do usuário em tempo real
    updateUserLocationPeriodically();

    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        const locations = snapshot.val();
        if (locations) {
            updateMarkers(locations);
        }
    });
};

// Atualiza a localização do usuário periodicamente
function updateUserLocationPeriodically() {
    if (navigator.geolocation) {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    const userRef = ref(database, 'locations/' + userId);
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    set(userRef, newLocation)
                        .then(() => {
                            console.log('Localização atualizada no Firebase:', newLocation);
                        })
                        .catch((error) => {
                            console.error('Erro ao atualizar localização:', error);
                        });
                }
            }, (error) => {
                console.error('Erro ao obter localização:', error);
            });
        }, 5000); // Atualiza a cada 5 segundos
    } else {
        console.error('Geolocalização não é suportada pelo navegador.');
    }
}

// Atualiza os marcadores no mapa
function updateMarkers(locations) {
    clearMarkers();
    for (const key in locations) {
        const location = locations[key];
        addMotoboyMarker(location, key);
    }
}

// Adiciona ou atualiza um marcador para um motoboy
function addMotoboyMarker(location, name) {
    if (markers[name]) {
        markers[name].setPosition(new google.maps.LatLng(location.latitude, location.longitude));
    } else {
        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            icon: {
                url: 'https://i.ibb.co/FHdgjcK/capacete.png',
                scaledSize: new google.maps.Size(50, 50)
            },
            title: name
        });

        const infowindow = new google.maps.InfoWindow({
            content: name
        });

        marker.addListener('mouseover', () => {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
            infowindow.close();
        });

        markers[name] = marker;
    }
}

// Limpa todos os marcadores
function clearMarkers() {
    for (const key in markers) {
        markers[key].setMap(null);
    }
    markers = {};
}
