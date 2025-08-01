const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Post = require('../src/models/postModel');

let mongoServer;

// Antes de todos os testes
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  // Sobrescreve a conexão do mongoose para usar o banco em memória
  await mongoose.connect(mongoUri); 
});

// Depois de todos os testes
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpa o banco de dados antes de cada teste
beforeEach(async () => {
  await Post.deleteMany({});
});


describe('API de Posts (/posts)', () => {

  // Teste para: POST /posts
  it('deve criar uma nova postagem', async () => {
    const newPostData = {
      title: 'Título do Teste',
      content: 'Conteúdo do teste',
      author: 'Tester',
    };

    const response = await request(app)
      .post('/posts')
      .send(newPostData);

    // Verifica a resposta
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newPostData.title);
    expect(response.body.author).toBe(newPostData.author);
    expect(response.body).toHaveProperty('_id');
  });

  // Teste para: GET /posts
  it('deve listar todas as postagens', async () => {
    // Cria alguns dados de teste primeiro
    await Post.create([
      { title: 'Post 1', content: 'Conteúdo 1', author: 'Autor 1' },
      { title: 'Post 2', content: 'Conteúdo 2', author: 'Autor 2' },
    ]);

    const response = await request(app).get('/posts');

    // Verifica a resposta
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe('Post 2'); // Ordenado por mais recente
  });

  // Teste para: GET /posts/:id
  it('deve buscar uma única postagem pelo ID', async () => {
    const post = await Post.create({ title: 'Post para buscar', content: 'Conteúdo', author: 'Autor' });
    
    const response = await request(app).get(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Post para buscar');
  });

   // Teste para: PUT /posts/:id
   it('deve atualizar uma postagem existente', async () => {
    const post = await Post.create({ title: 'Post Original', content: 'Conteúdo Original', author: 'Autor' });
    const updatedData = { title: 'Título Atualizado', content: 'Conteúdo Atualizado' };

    const response = await request(app)
      .put(`/posts/${post._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.content).toBe(updatedData.content);
  });

  // Teste para: DELETE /posts/:id
  it('deve deletar uma postagem', async () => {
    const post = await Post.create({ title: 'Post para Deletar', content: 'Conteúdo', author: 'Autor' });
    
    const deleteResponse = await request(app).delete(`/posts/${post._id}`);
    expect(deleteResponse.statusCode).toBe(200);

    // Verifica se o post foi realmente deletado
    const getResponse = await request(app).get(`/posts/${post._id}`);
    expect(getResponse.statusCode).toBe(404);
  });
});