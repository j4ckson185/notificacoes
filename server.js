const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para enviar relatórios
app.post('/upload_report', (req, res) => {
    const { motoboy, date, report } = req.body;

    if (!motoboy || !date || !report) {
        return res.status(400).json({ error: 'Dados do relatório incompletos.' });
    }

    const filePath = path.join(__dirname, 'reports', `${motoboy}-${date}.json`);
    fs.writeFile(filePath, JSON.stringify(report, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar o relatório:', err);
            return res.status(500).json({ error: 'Erro ao salvar o relatório.' });
        }
        res.status(200).json({ message: 'Relatório enviado com sucesso.' });
    });
});

// Endpoint para obter relatórios
app.get('/get_report', (req, res) => {
    const { motoboy, date } = req.query;

    if (!motoboy || !date) {
        return res.status(400).json({ error: 'Parâmetros incompletos.' });
    }

    const filePath = path.join(__dirname, 'reports', `${motoboy}-${date}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ error: 'Relatório não encontrado.' });
            }
            console.error('Erro ao ler o relatório:', err);
            return res.status(500).json({ error: 'Erro ao ler o relatório.' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Erro ao analisar o JSON do relatório:', parseError);
            res.status(500).json({ error: 'Erro ao processar o relatório.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
