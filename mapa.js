import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getAuth } from './firebase-config.js';

const database = getDatabase();
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
            if (typeof data.lat === 'number' && typeof data.lng === 'number') {
                new google.maps.Marker({
                    position: { lat: data.lat, lng: data.lng },
                    map,
                    icon: {
                        url: "https://i.ibb.co/FHdgjcK/capacete.png", // Ícone do capacete
                        scaledSize: new google.maps.Size(45, 45) // Tamanho do ícone
                    },
                    title: data.name,
                    label: data.name,
                });
            }
        });
    });
}

// Expor initMap para ser chamado pela API do Google Maps
window.initMap = initMap;
