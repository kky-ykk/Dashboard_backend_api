// models/Blog.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  image: {
    type: String,           
    // required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  }
}, {
  timestamps: true          
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
