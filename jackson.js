import { messaging, getToken, onMessage, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, database, ref, onChildAdded, remove, firestore, setDoc, doc } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

// Nome do motoboy fixo para Jackson
const motoboy = 'jackson_division@hotmail.com';

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}

// Lógica de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loginForm.reset();
            saveToken(email);
        })
        .catch((error) => {
            alert('Erro ao entrar: ' + error.message);
        });
});

// Lógica de Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Logout bem-sucedido
    }).catch((error) => {
        alert('Erro ao sair: ' + error.message);
    });
});

// Botão para apagar todas as mensagens
deleteAllButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todas as mensagens?')) {
        const messagesRef = ref(database, `messages/${motoboy}`);
        remove(messagesRef).then(() => {
            messagesDiv.innerHTML = '';
        }).catch((error) => {
            alert('Erro ao apagar mensagens: ' + error.message);
        });
    }
});

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        authDiv.style.display = 'none';
        messagesSection.style.display = 'block';
        loadMessages();
    } else {
        authDiv.style.display = 'block';
        messagesSection.style.display = 'none';
    }
});

// Função para carregar as mensagens
function loadMessages() {
    const messagesRef = ref(database, `messages/${motoboy}`);
    messagesDiv.innerHTML = '';
    onChildAdded(messagesRef, (data) => {
        const message = data.val().text;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            remove(ref(database, `messages/${motoboy}/${data.key}`));
        });

        messageElement.appendChild(deleteButton);
        messagesDiv.appendChild(messageElement);

        // Mostrar notificação e tocar som
        showNotification(message);
    });
}

// Função para tocar o som de notificação
function playNotificationSound() {
    notificationSound.currentTime = 0; // Rewind to start
    const playPromise = notificationSound.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error('Erro ao reproduzir o som de notificação:', error);
        });
    }
}

// Solicitar permissão para notificações
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permissão para notificações concedida.');
                // Solicitar permissão para tocar som no iOS
                requestAudioPermission();
            }
        });
    }
}

// Solicitar permissão para tocar som no iOS
function requestAudioPermission() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start(0);
    oscillator.stop(0);
}

// Mostrar notificação e tocar som
function showNotification(message) {
    if ('Notification' in window && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Nova mensagem', {
                body: message,
                tag: 'new-message',
                icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png'
            });

            // Tocar o som após mostrar a notificação
            playNotificationSound();
        });
    }
}

// Preparar o som para tocar
window.addEventListener('load', () => {
    notificationSound.play().catch(error => {
        console.log('Erro ao preparar o som de notificação:', error);
    });
});

// Listener para mensagens recebidas em primeiro plano
onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em primeiro plano:', payload);
    const message = payload.notification.body;
    showNotification(message);
});

// Função para salvar o token FCM no Firestore
function saveToken(email) {
    getToken(messaging, { vapidKey: 'BJIv4vMW_5J4Zlus1ueRy2UlLqT3rOAoz63xZXBlS93_cE9QTplnB4kDiFBgE-B7U2QXobcDKK-6VqGAdyC47_Q' })
        .then((currentToken) => {
            if (currentToken) {
                const tokenRef = doc(firestore, 'tokens', email);
                setDoc(tokenRef, { token: currentToken })
                    .then(() => {
                        console.log('Token FCM salvo com sucesso.');
                    })
                    .catch((error) => {
                        console.error('Erro ao salvar o token FCM:', error);
                    });
            } else {
                console.log('Nenhum token de registro disponível. Solicite permissão para gerar um.');
            }
        })
        .catch((error) => {
            console.error('Erro ao obter o token FCM:', error);
        });
}
