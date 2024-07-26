// Inicializa o Firebase
firebase.initializeApp(firebaseConfig); // Substitua firebaseConfig pela sua configuração

// Referências aos elementos do DOM
const form = document.getElementById('financial-form');
const totalValueElement = document.getElementById('total-value');

// Função para calcular o valor total a receber
function calculateTotal() {
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const sameHouse = parseInt(document.getElementById('same-house').value) || 0;
    const valueReceived = parseFloat(document.getElementById('value-received').value) || 0;
    
    const totalReceivable = quantity - sameHouse - valueReceived;
    totalValueElement.textContent = `R$ ${totalReceivable.toFixed(2)}`;
}

// Adiciona o evento de cálculo ao input do formulário
form.addEventListener('input', calculateTotal);

// Adiciona o evento de envio do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Aqui você deve obter o usuário autenticado
    const user = firebase.auth().currentUser;

    if (!user) {
        alert('Você deve estar logado para enviar o formulário.');
        return;
    }

    // Obtenha os dados do formulário
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        quantity: parseInt(formData.get('quantity')),
        sameHouse: parseInt(formData.get('same-house')),
        valueReceived: parseFloat(formData.get('value-received')),
        pix: formData.get('pix'),
        paymentStatus: formData.get('payment-status'),
        userId: user.uid,
        date: new Date().toISOString()
    };

    try {
        // Salve os dados no Firebase Firestore
        const db = firebase.firestore();
        await db.collection('financial_reports').add(data);
        alert('Relatório enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar relatório: ', error);
        alert('Erro ao enviar relatório.');
    }
});
