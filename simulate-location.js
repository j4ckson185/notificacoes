// Importar Firebase e configurar o banco de dados
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Configuração do Firebase (substitua pelos seus detalhes)
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
const database = getDatabase(app);

// Função para simular a localização
function simulateLocation() {
    let lat = -5.748178; // Latitude inicial
    let lng = -35.256141; // Longitude inicial

    setInterval(() => {
        // Simular variação na latitude e longitude
        lat += (Math.random() - 0.5) * 0.01; // Pequenas variações
        lng += (Math.random() - 0.5) * 0.01;

        // Atualizar o Firebase com a nova localização
        const userId = "testUser"; // Substitua pelo ID do usuário de teste
        const userRef = ref(database, 'locations/' + userId);
        set(userRef, {
            latitude: lat,
            longitude: lng
        })
        .then(() => {
            console.log('Localização simulada atualizada:', { latitude: lat, longitude: lng });
        })
        .catch((error) => {
            console.error('Erro ao atualizar localização simulada:', error);
        });
    }, 5000); // Atualiza a cada 5 segundos
}

// Chama a função para iniciar a simulação
simulateLocation();
