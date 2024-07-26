// jackson.js
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const clearMessagesButton = document.getElementById('clearMessagesButton');
    const logoutButton = document.getElementById('logoutButton');

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

    // Listen for changes in the Realtime Database
    window.firebaseDatabase.ref('messages').on('value', (snapshot) => {
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                const messageData = childSnapshot.val();
                const messageElement = document.createElement('div');
                messageElement.textContent = messageData.text || 'Mensagem sem texto';
                messagesContainer.appendChild(messageElement);
            });
        }
    });

    // Listen for FCM messages
    if (window.firebaseMessaging) {
        window.firebaseMessaging.onMessage((payload) => {
            console.log('Received FCM message:', payload);
            const messageData = payload.data;
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.text || 'Mensagem sem texto';
            messagesContainer.appendChild(messageElement);
        });
    }

    // Clear all messages
    clearMessagesButton.addEventListener('click', () => {
        window.firebaseDatabase.ref('messages').remove();
        messagesContainer.innerHTML = '';
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        window.firebaseAuth.signOut()
            .then(() => {
                console.log('Signed out');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
});
