const jwt = require('jsonwebtoken');
const secretKey = 'your-generated-secret-key-here';

const tokenMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.get('Authorization');

  if (!token || !token.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }

  const tokenWithoutBearer = token.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify the token
    const decodedToken = jwt.verify(tokenWithoutBearer, config.SECRET);

    // Attach the user information to the request object
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }
};

module.exports = tokenMiddleware;
