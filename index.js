import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const auth = getAuth();
const messaging = getMessaging();
const database = getDatabase();

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get FCM token
        const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' }); // Replace with your actual VAPID key
        if (currentToken) {
            // Save token to database
            await set(ref(database, 'tokens/' + user.uid), {
                token: currentToken
            });

            // Redirect to the specific page
            window.location.href = emailToPage(email);
        } else {
            console.log('No registration token available.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

function emailToPage(email) {
    const emailMap = {
        'jackson_division@hotmail.com': 'jackson.html' // Add other users' emails and page names
    };
    return emailMap[email] || 'index.html'; // Default to index.html if no match
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .
