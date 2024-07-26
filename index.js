// index.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (window.firebaseMessaging) {
            // Get FCM token
            const currentToken = await firebaseMessaging.getToken({ vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });
            if (currentToken) {
                // Save token to database
                await firebaseDatabase.ref('tokens/' + user.uid).set({
                    token: currentToken
                });

                // Redirect to the specific page
                window.location.href = emailToPage(email);
            } else {
                console.log('No registration token available.');
            }
        } else {
            // Redirect to the specific page
            window.location.href = emailToPage(email);
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

function emailToPage(email) {
    const emailMap = {
        'jackson_division@hotmail.com': 'jackson.html',
        'giovanni.silva18@gmail.com': 'geovane.html',
        'felipeaugusto02001@gmail.com': 'felipeaugusto.html',
        'hionarabeatriz11@gmail.com': 'hionara.html',
        'moises110723@gmail.com': 'moises.html',
        'boazd3@gmail.com': 'boaz.html',
        'fellipeirineu90@gmail.com': 'fellipematheus.html'
    };
    return emailMap[email] || 'index.html'; // Default to index.html if no match
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch(err => {
            console.error('Error registering Service Worker:', err);
        });
}

// Handle user authentication state changes
firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in:', user);
    } else {
        console.log('User is signed out');
    }
});
