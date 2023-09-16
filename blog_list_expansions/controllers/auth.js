const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verify username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate and send token
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    res.status(200).json({ token, username: user.username, name: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login };
