import { getAuth, signInWithEmailAndPassword } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
