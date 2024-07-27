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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

let map;
let userMarkers = {};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -15.7801, lng: -47.9292 }, // Centro do Brasil
        zoom: 5
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            startLocationTracking(user.email);
            listenToUserLocations();
        } else {
            window.location.href = 'index.html';
        }
    });
}

function startLocationTracking(userEmail) {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            updateUserLocation(userEmail, latitude, longitude);
        }, (error) => {
            console.error("Erro ao obter localização:", error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }
}

function updateUserLocation(userEmail, latitude, longitude) {
    const userRef = firebase.database().ref(`users/${userEmail.replace('.', ',')}`);
    userRef.set({
        email: userEmail,
        latitude: latitude,
        longitude: longitude,
        lastUpdate: new Date().toISOString()
    });
}

function listenToUserLocations() {
    const usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((key) => {
                const user = data[key];
                updateMarker(user);
            });
        }
    });
}

function updateMarker(user) {
    const position = new google.maps.LatLng(user.latitude, user.longitude);
    
    if (userMarkers[user.email]) {
        userMarkers[user.email].setPosition(position);
    } else {
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: {
                url: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png', // Substitua pelo URL do ícone do capacete
                scaledSize: new google.maps.Size(45, 45)
            },
            title: user.email
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div>${user.email}</div>`
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        userMarkers[user.email] = marker;
    }
}

// Inicializar o mapa quando a página carregar
google.maps.event.addDomListener(window, 'load', initMap);

// Atualizar localizações a cada 5 segundos
setInterval(() => {
    if (firebase.auth().currentUser) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            updateUserLocation(firebase.auth().currentUser.email, latitude, longitude);
        });
    }
}, 5000);
