// index.js
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Autenticação com Firebase (use o SDK do Firebase)
    // Exemplo:
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Sucesso! Redirecione para a página de painel administrativo
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            console.error('Erro ao fazer login:', error);
        });
});
