// mapa.js
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

    // Atualizar localização dos motoboys
    firebaseDatabase.ref('locations').on('value', (snapshot) => {
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
