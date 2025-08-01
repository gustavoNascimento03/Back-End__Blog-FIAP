const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Antes de todos os testes, cria e conecta ao banco de dados em memória
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Depois de todos os testes, desconecta e para o banco de dados
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpa os dados entre cada teste para garantir isolamento
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});