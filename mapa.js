// mapa.js

import { getDatabase, ref, onValue } from './firebase-config.js';

let map;
let markers = {}; // Para armazenar marcadores

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -5.748178, lng: -35.256141 }, // Coordenadas da loja
        zoom: 15
    });

    // Solicitar permissão de localização
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                new google.maps.Marker({
                    position: pos,
                    map,
                    icon: {
                        url: "https://i.ibb.co/FHdgjcK/capacete.png", // Ícone do capacete
                        scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone
                    },
                    title: "Minha localização",
                });

                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }

    // Atualizar localização dos motoboys a cada 5 segundos
    updateMarkers();
    setInterval(updateMarkers, 5000);
}

function updateMarkers() {
    const database = getDatabase();
    const locationsRef = ref(database, 'locations');

    onValue(locationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Limpar marcadores existentes
            Object.values(markers).forEach(marker => marker.setMap(null));
            markers = {};

            Object.values(data).forEach((location) => {
                if (typeof location.lat === 'number' && typeof location.lng === 'number') {
                    const marker = new google.maps.Marker({
                        position: { lat: location.lat, lng: location.lng },
                        map,
                        icon: {
                            url: "https://i.ibb.co/FHdgjcK/capacete.png", // Ícone do capacete
                            scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone
                        },
                        title: location.uid, // Exibir UID no infowindow
                    });

                    marker.addListener('click', () => {
                        const infoWindow = new google.maps.InfoWindow({
                            content: `<div><strong>UID:</strong> ${location.uid}</div>`,
                        });
                        infoWindow.open(map, marker);
                    });

                    markers[location.uid] = marker; // Armazenar marcador
                }
            });
        }
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow({
        position: pos,
    });
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

// Expor initMap para ser chamado pela API do Google Maps
window.initMap = initMap;
