// mapa.js
import { database, ref, onValue } from './firebase-config.js';

let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 12
    });

    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        const locations = snapshot.val();
        if (locations) {
            clearMarkers();

            for (const key in locations) {
                const location = locations[key];
                addMarker(location);
            }
        }
    });
}

let markers = [];

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        icon: 'path_to_helmet_icon.png' // Substitua pelo caminho do ícone do capacete
    });
    markers.push(marker);
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

window.initMap = initMap;
