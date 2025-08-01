const Post = require('../models/postModel');

// POST /posts - cria as postagens
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar postagem', error });
  }
};

// GET /posts - lista os post p/ tds
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar postagens', error });
  }
};

// GET /posts/:id - leitura do post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Postagem não encontrada' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar postagem', error });
  }
};

// PUT /posts/:id - edição do post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // Retorna o documento atualizado
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Postagem não encontrada' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao editar postagem', error });
  }
};

// DELETE /posts/:id - exclusão do post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Postagem não encontrada' });
    }
    res.status(200).json({ message: 'Postagem deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar postagem', error });
  }
};

// GET /posts/search - busca o post
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query; // Pega o termo de busca da URL
    const posts = await Post.find({ $text: { $search: q } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar busca', error });
  }
};