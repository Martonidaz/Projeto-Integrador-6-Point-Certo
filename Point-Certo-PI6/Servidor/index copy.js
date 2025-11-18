const express = require('express');
const app = express();
const PORT = 3000;

// Simulação de dados (aqui entrará a sua lógica de IA depois)
app.get('/recomendacoes', (req, res) => {
    res.json([
        { nome: "Restaurante Come Bem", tipo: "Alimentação" },
        { nome: "Hospital São Lucas", tipo: "Emergência" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor a rodar no seu PC: http://localhost:${PORT}`);
});