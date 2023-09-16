const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const blogsRouter = require('./routes/blogs');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app; 