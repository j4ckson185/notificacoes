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

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log('Login bem-sucedido');
        // Redirecionar ou realizar outra ação após login
        window.location.href = 'mapa.html'; // Exemplo de redirecionamento
    } catch (error) {
        console.error('Erro ao fazer login', error);
    }
});

// Função para manter o usuário logado
window.onload = function() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('Usuário já autenticado');
            // Redirecionar ou realizar outra ação após o login automático
            window.location.href = 'mapa.html'; // Exemplo de redirecionamento
        }
    });
};
