// Não use "export" neste arquivo. Em vez disso, defina a configuração diretamente.
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
const messaging = firebase.messaging();
const db = firebase.firestore();
