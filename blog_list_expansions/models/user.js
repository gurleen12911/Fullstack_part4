const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // Reference to the Blog model
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
