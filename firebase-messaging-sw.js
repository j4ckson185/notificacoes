importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png',
        data: {
            sound: '/assets/notification.mp3',
            click_action: 'https://cabananotificacoes.netlify.app/jackson.html' // URL para abrir ao clicar na notificação
        }
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    const sound = event.notification.data.sound;
    event.notification.close();

    // Open the URL when the user clicks on the notification
    event.waitUntil(clients.openWindow(event.notification.data.click_action));

    // Play sound
    const audio = new Audio(sound);
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });
});
