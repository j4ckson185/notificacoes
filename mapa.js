// mapa.js
// Substitua com suas configurações do Firebase
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

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -5.748178, lng: -35.256141 },
        zoom: 15
    });

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
    setInterval(updateMotoboysLocation, 5000);
}

function updateMotoboysLocation() {
    const locationsRef = database.ref('locations');
    locationsRef.on('value', (snapshot) => {
        map.clear(); // Limpa o mapa antes de adicionar novos marcadores
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (typeof data.lat === 'number' && typeof data.lng === 'number') {
                new google.maps.Marker({
                    position: { lat: data.lat, lng: data.lng },
                    map,
                    icon: {
                        url: "https://i.ibb.co/FHdgjcK/capacete.png",
                        scaledSize: new google.maps.Size(45, 45)
                    },
                    title: data.uid,
                    label: data.uid,
                }).addListener('click', function() {
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

window.initMap = initMap;
