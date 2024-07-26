let map;
let marker;

function initMap() {
    const mapOptions = {
        center: { lat: -5.748178, lng: -35.256141 }, // Coordenadas iniciais
        zoom: 15
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    marker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: "Localização Simulada"
    });

    // Simular a atualização da localização
    simulateLocation();
}

function simulateLocation() {
    let lat = -5.748178;
    let lng = -35.256141;

    setInterval(() => {
        lat += 0.0001; // Simula o movimento
        lng += 0.0001; // Simula o movimento

        // Atualiza a posição do marcador
        marker.setPosition({ lat: lat, lng: lng });

        // Atualiza o centro do mapa
        map.setCenter({ lat: lat, lng: lng });
    }, 5000); // Atualiza a cada 5 segundos
}
