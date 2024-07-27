importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js');

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

self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativado');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
});

self.addEventListener('notificationclose', event => {
    console.log('Notificação fechada');
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'START_LOCATION_TRACKING') {
        startLocationTracking(event.data.userEmail);
    }
});

function startLocationTracking(userEmail) {
    setInterval(() => {
        if ('geolocation' in self) {
            self.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    updateUserLocation(userEmail, latitude, longitude);
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
    }, 5000);
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
