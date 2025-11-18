const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose(); // Importa o Banco
const app = express();
const PORT = 3000;

app.use(express.json());

// --- SUA CHAVE DO GOOGLE ---
const GOOGLE_API_KEY = 'AIzaSyCQCFPHm5TTTJ9NCnYMZeI6hIKmRQCzr6k'; 
// --------------------------

// --- CONFIGURAÇÃO DO BANCO DE DADOS (SQLite) ---
// Cria/Abre o arquivo do banco
const db = new sqlite3.Database('./banco_dados.sqlite', (err) => {
    if (err) console.error('Erro ao abrir banco:', err.message);
    else console.log('📦 Banco de Dados SQL conectado com sucesso!');
});

// Cria a tabela de visitas se ela não existir
db.run(`CREATE TABLE IF NOT EXISTS visitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id TEXT,
    local_id INTEGER,
    data TEXT
)`);
// -----------------------------------------------

app.get('/recomendacoes', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(`📍 Pedido via Wi-Fi/USB! GPS: ${lat}, ${lon}`);

    if (!lat || !lon) return res.json([{ id: 0, nome: "Erro GPS", tipo: "Aviso" }]);

    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=2000&type=restaurant|hospital|bar&language=pt-BR&key=${GOOGLE_API_KEY}`;
        const resposta = await axios.get(url);

        if (resposta.data.status !== 'OK') return res.json([{ id: 0, nome: "Erro Google", tipo: "Erro" }]);

        const locais = resposta.data.results.map((l, i) => {
            let tipo = 'Alimentação';
            if (l.types.includes('hospital') || l.types.includes('health')) tipo = 'Emergência';
            else if (l.types.includes('bar') || l.types.includes('night_club')) tipo = 'Lazer';

            return {
                id: i + 1000,
                place_id: l.place_id,
                nome: l.name,
                tipo: tipo, 
                endereco: l.vicinity,
                lat: l.geometry.location.lat,
                lon: l.geometry.location.lng
            };
        });

        console.log(`✅ Enviando ${locais.length} locais.`);
        res.json(locais);

    } catch (e) {
        console.log("Erro:", e.message);
        res.status(500).json([]);
    }
});

app.post('/registrar_visita', (req, res) => {
    const { usuario_id, local_id } = req.body;
    const dataHoje = new Date().toISOString();

    // --- SALVANDO NO BANCO SQL ---
    const query = `INSERT INTO visitas (usuario_id, local_id, data) VALUES (?, ?, ?)`;
    
    db.run(query, [usuario_id, local_id, dataHoje], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ erro: "Erro ao salvar no banco" });
        }
        console.log(`💾 VISITA PERSISTIDA! ID no Banco: ${this.lastID} | Local: ${local_id}`);
        res.json({ ok: true, id_visita: this.lastID });
    });
});

// Importante: Ouvir em 0.0.0.0 permite acesso Wi-Fi
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor Rodando na porta ${PORT}`));