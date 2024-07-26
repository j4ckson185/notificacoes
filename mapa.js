import { database, ref, onValue } from './firebase-config.js';

let map;
let markers = {};

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
            updateMarkers(locations);
        }
    });
};

// Atualiza os marcadores no mapa
function updateMarkers(locations) {
    for (const key in locations) {
        const location = locations[key];
        if (markers[key]) {
            markers[key].setPosition(new google.maps.LatLng(location.latitude, location.longitude));
        } else {
            addMotoboyMarker(location, key);
        }
    }
}

// Adiciona ou atualiza um marcador para um motoboy
function addMotoboyMarker(location, name) {
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
