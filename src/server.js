const mongoose = require('mongoose');
const app = require('./app');
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    // Inicia o servidor APENAS se a conexão com o banco for bem-sucedida
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao banco
  });