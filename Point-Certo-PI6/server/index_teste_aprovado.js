const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- SUA CHAVE DO GOOGLE ---
const GOOGLE_API_KEY = 'AIzaSyCQCFPHm5TTTJ9NCnYMZeI6hIKmRQCzr6k'; 
// --------------------------

const visitas = [];

app.get('/recomendacoes', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(`📍 Pedido recebido! GPS: ${lat}, ${lon}`);

    if (!lat || !lon) {
        console.log("Sem GPS. Enviando aviso.");
        return res.json([{ id: 0, nome: "Erro: GPS não enviado", tipo: "Aviso" }]);
    }

    try {
        // Busca num raio de 2km (2000 metros)
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=2000&type=restaurant|hospital|bar&language=pt-BR&key=${GOOGLE_API_KEY}`;
        
        console.log("🔍 Consultando Google Maps...");
        const resposta = await axios.get(url);

        if (resposta.data.status !== 'OK') {
            console.log("❌ Erro Google:", resposta.data.status);
            console.log("Detalhe:", resposta.data.error_message);
            return res.json([{ id: 0, nome: "Erro na Chave Google", tipo: "Erro" }]);
        }

        // Formata os dados para o App
        // Melhorei a lógica de 'tipo' para bater com os ícones do Flutter
        const locais = resposta.data.results.map((l, i) => {
            let tipoFormatado = 'Alimentação'; // Padrão
            if (l.types.includes('hospital') || l.types.includes('health')) tipoFormatado = 'Emergência';
            else if (l.types.includes('bar') || l.types.includes('night_club')) tipoFormatado = 'Lazer';

            return {
                id: i + 1000,
                place_id: l.place_id,
                nome: l.name,
                tipo: tipoFormatado, 
                endereco: l.vicinity,
                lat: l.geometry.location.lat,
                lon: l.geometry.location.lng
            };
        });

        console.log(`✅ Sucesso! Encontrei ${locais.length} locais reais.`);
        res.json(locais);

    } catch (e) {
        console.log("Erro interno:", e.message);
        res.status(500).json([]);
    }
});

app.post('/registrar_visita', (req, res) => {
    // Aqui é onde a IA aprenderia futuramente
    console.log(`💾 VISITA REGISTRADA: O usuário clicou no local ID ${req.body.local_id}`);
    res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor Google rodando na porta ${PORT}`));