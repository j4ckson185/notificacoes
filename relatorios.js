// relatorios.js
import { database, ref, onValue, query, orderByChild, equalTo, set } from './firebase-config.js';

document.getElementById('applyFilter').addEventListener('click', () => {
    const motoboyEmail = document.getElementById('motoboy').value;
    const selectedDate = document.getElementById('date').value;

    if (!motoboyEmail || !selectedDate) {
        alert('Por favor, selecione o motoboy e a data.');
        return;
    }

    const reportsRef = ref(database, 'reports/' + motoboyEmail.replace(/\./g, '_'));

    // Query to get reports by selected date
    const reportsQuery = query(reportsRef, orderByChild('date'), equalTo(selectedDate));

    onValue(reportsQuery, (snapshot) => {
        const reportsContainer = document.getElementById('reportsContainer');
        reportsContainer.innerHTML = ''; // Clear previous reports

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const report = childSnapshot.val();
                const reportElement = document.createElement('div');
                reportElement.innerHTML = `
                    <p>Nome: ${report.name}</p>
                    <p>Quantidade de Entregas: ${report.deliveries}</p>
                    <p>Entregas na Mesma Casa: ${report.sameHouseDeliveries}</p>
                    <p>Valor Recebido: ${report.amountReceived}</p>
                    <p>Pix: ${report.pix}</p>
                    <p>Status: ${report.status}</p>
                    <p>Data: ${report.date}</p>
                    <p>Turno: ${report.shift === '35' ? 'Um turno' : 'Dois turnos'}</p>
                    <p>Valor Total a Receber: ${report.totalAmountToReceive}</p>
                    <p>Timestamp: ${report.timestamp}</p>
                    <button onclick="editReport('${childSnapshot.key}')">Editar</button>
                    <button onclick="deleteReport('${childSnapshot.key}')">Remover</button>
                `;
                reportsContainer.appendChild(reportElement);
            });
        } else {
            reportsContainer.innerHTML = '<p>Nenhum relatório encontrado para a data selecionada.</p>';
        }
    }, (error) => {
        console.error('Erro ao buscar relatórios:', error);
    });
});

window.editReport = function(reportId) {
    // Lógica para editar o relatório
};

window.deleteReport = function(reportId) {
    const motoboyEmail = document.getElementById('motoboy').value;
    const reportRef = ref(database, 'reports/' + motoboyEmail.replace(/\./g, '_') + '/' + reportId);
    set(reportRef, null)
        .then(() => {
            alert('Relatório removido com sucesso');
            document.getElementById('applyFilter').click(); // Reapply filter to refresh reports
        })
        .catch((error) => {
            console.error('Erro ao remover relatório:', error);
        });
};
