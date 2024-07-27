// index.js
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
        await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('Login bem-sucedido');
        // Salvar email no localStorage
        localStorage.setItem('userEmail', email);
        // Redirecionar ou realizar outra ação após login
    } catch (error) {
        console.error('Erro ao fazer login', error);
    }
});

// Função para manter o usuário logado
window.onload = function() {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
        const password = 'user_password'; // Senha deve ser armazenada com segurança, aqui está apenas para o exemplo
        firebase.auth().signInWithEmailAndPassword(storedEmail, password)
            .then(() => {
                console.log('Login automático bem-sucedido');
            })
            .catch(error => {
                console.error('Erro ao fazer login automático', error);
            });
    }
};
