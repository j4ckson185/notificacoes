import { database, ref, onValue } from './firebase-config.js';

let map;
let markers = [];

window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 12
    });

    // Adiciona a localização da loja
    addStoreMarker({ lat: -5.748178, lng: -35.256141 }, 'https://i.ibb.co/D766RTL/loja.png');

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
}

function addStoreMarker(position, iconUrl) {
    new google.maps.Marker({
        position: position,
        map: map,
        icon: iconUrl,
        title: 'Loja'
    });
}

function addMotoboyMarker(location, name) {
    const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        icon: 'path_to_helmet_icon.png', // Substitua pelo caminho do ícone do capacete
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

window.initMap = initMap;
