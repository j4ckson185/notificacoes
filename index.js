import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login bem-sucedido');
    } catch (error) {
        console.error('Erro ao fazer login', error);
    }
});
