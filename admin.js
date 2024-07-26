<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo - Enviar Notificações</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Painel Administrativo - Enviar Notificações</h1>
        <form id="sendMessageForm">
            <label for="userSelect">Selecionar Usuário:</label>
            <select id="userSelect">
                <option value="jackson">Jackson</option>
                <option value="felipeaugusto">Felipe Augusto</option>
                <option value="hionara">Hionara</option>
                <option value="geovane">Giovanni</option>
                <option value="moises">Moisés</option>
                <option value="boaz">Boaz</option>
            </select>
            <label for="messageInput">Mensagem:</label>
            <input type="text" id="messageInput" required>
            <button type="submit">Enviar</button>
        </form>
    </div>

    <!-- Firebase scripts -->
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js" type="module"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js" type="module"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js" type="module"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js" type="module"></script>

    <!-- Your custom scripts -->
    <script src="admin.js" type="module"></script>
</body>
</html>
