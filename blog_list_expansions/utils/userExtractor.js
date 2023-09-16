const jwt = require('jsonwebtoken');
const generateSecretKey = require('../generateSecretKey'); 
const User = require('../models/user');

const userExtractor = async (req, res, next) => {
  try {
    const token = req.token; // Get the token from the request

    if (!token) {
      // If no token is present, set request.user to null
      req.user = null;
      return next();
    }

    // Verify the token
    const decodedToken = jwt.verify(token, config.SECRET);

    if (!decodedToken.id) {
      // If the token is missing a user ID, set request.user to null
      req.user = null;
      return next();
    }

    // Find the user associated with the token
    const user = await User.findById(decodedToken.id);

    // Set the user in the request object
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userExtractor;
