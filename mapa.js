import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    measurementId: "G-96Y337GYT8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let map;
const markers = {};

// Inicializa o mapa
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
                        url: "https://i.ibb.co/FHdgjcK/capacete.png",
                        scaledSize: new google.maps.Size(45, 45)
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
        handleLocationError(false, map.getCenter());
    }

    // Atualizar localização dos motoboys a cada 5 segundos
    setInterval(() => {
        updateMotoboyLocations();
    }, 5000);
}

// Atualiza a localização dos motoboys
function updateMotoboyLocations() {
    const locationsRef = ref(db, 'locations');
    onValue(locationsRef, (snapshot) => {
        const data = snapshot.val();
        for (const uid in data) {
            if (data.hasOwnProperty(uid)) {
                const pos = { lat: data[uid].lat, lng: data[uid].lng };
                if (markers[uid]) {
                    markers[uid].setPosition(pos);
                } else {
                    markers[uid] = new google.maps.Marker({
                        position: pos,
                        map,
                        icon: {
                            url: "https://i.ibb.co/FHdgjcK/capacete.png",
                            scaledSize: new google.maps.Size(45, 45)
                        },
                        title: uid,
                    });

                    markers[uid].addListener('click', () => {
                        const infoWindow = new google.maps.InfoWindow({
                            content: `<p>UID: ${uid}</p>`,
                        });
                        infoWindow.open(map, markers[uid]);
                    });
                }
            }
        }
    });
}

// Lida com erros de localização
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
