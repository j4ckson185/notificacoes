import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -5.748178, lng: -35.256141 }, // Coordenadas da loja
        zoom: 15
    });

    // Atualizar localização dos usuários
    const locationsRef = ref(database, 'locations');
    onValue(locationsRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const userId = childSnapshot.key; // Obtenha o UID

            if (typeof data.lat === 'number' && typeof data.lng === 'number') {
                const marker = new google.maps.Marker({
                    position: { lat: data.lat, lng: data.lng },
                    map,
                    icon: {
                        url: "https://i.ibb.co/FHdgjcK/capacete.png", // Ícone do capacete
                        scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone
                    },
                    title: data.name,
                });

                // Crie uma janela de informação
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>ID do Usuário:</strong> ${userId}</div>`
                });

                // Adicione um evento de clique no marcador para abrir a janela de informação
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            }
        });
    });
}

// Expor initMap para ser chamado pela API do Google Maps
window.initMap = initMap;
