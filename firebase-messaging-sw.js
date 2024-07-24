importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E", // Replace with your actual API key
    authDomain: "cabana-8d55e.firebaseapp.com", // Replace with your actual auth domain
    projectId: "cabana-8d55e", // Replace with your actual project ID
    storageBucket: "cabana-8d55e.appspot.com", // Replace with your actual storage bucket
    messagingSenderId: "706144237954", // Replace with your actual messaging sender ID
    appId: "1:706144237954:web:345c10370972486afc779b", // Replace with your actual app ID
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com" // Replace with your actual database URL

};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png' // Replace with your icon URL
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
