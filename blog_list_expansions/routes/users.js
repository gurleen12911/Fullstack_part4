const bcrypt = require('bcryptjs');

const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken'); 

// Route to create new users
usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response.status(400).json({ error: 'Both username and password must be provided' });
  }

  if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({ error: 'Both username and password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique' });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  // Save the user
  const savedUser = await newUser.save();

  // Generate a JWT token for the newly created user
  const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET);

  response.json({ token, username: savedUser.username, name: savedUser.name });
});


// Route to get all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    id: 1,
  });

  response.json(users);
});

module.exports = usersRouter;
