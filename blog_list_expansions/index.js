const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userExtractor = require('./utils/userExtractor');
require('dotenv').config();

const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users');
const middleware = require('./utils/middleware'); 


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

app.use(middleware.tokenExtractor); 

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', userExtractor, blogsRouter);
module.exports = app;
