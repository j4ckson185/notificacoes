import { database, ref, onValue } from './firebase-config.js';

let map;
let markers = [];

// Inicializa o mapa e carrega as localizações
window.initMap = function() {
    const storeLocation = { lat: -5.748178, lng: -35.256141 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: storeLocation,
        zoom: 15
    });

    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        const locations = snapshot.val();
        if (locations) {
            clearMarkers();
            for (const key in locations) {
                const location = locations[key];
                addMotoboyMarker(location, key);
            }
        }
    });
};

function addMotoboyMarker(location, name) {
    const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        icon: {
            url: 'https://i.ibb.co/FHdgjcK/capacete.png', // URL do ícone
            scaledSize: new google.maps.Size(20, 20) // Tamanho reduzido do ícone
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

    markers.push(marker);
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}
