// mapa.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Configure o Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map;

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
    setInterval(() => {
        updateMotoboysLocation();
    }, 5000);
}

function updateMotoboysLocation() {
    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        map.clear(); // Limpa o mapa antes de adicionar novos marcadores
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (typeof data.lat === 'number' && typeof data.lng === 'number') {
                new google.maps.Marker({
                    position: { lat: data.lat, lng: data.lng },
                    map,
                    icon: {
                        url: "https://i.ibb.co/FHdgjcK/capacete.png", // Ícone do capacete
                        scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone
                    },
                    title: data.uid, // Exibir o UID no título
                    label: data.uid, // Exibir o UID como rótulo
                }).addListener('click', () => {
                    const infoWindow = new google.maps.InfoWindow({
                        content: `UID: ${data.uid}`
                    });
                    infoWindow.open(map, this);
                });
            }
        });
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
