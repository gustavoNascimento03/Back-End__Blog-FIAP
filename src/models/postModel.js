const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  // A chance de o problema estar aqui é de 99%
  createdAt: {
    type: Date,
    default: Date.now // Esta linha é a mais importante
  }
});

postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;