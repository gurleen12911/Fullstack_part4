const jwt = require('jsonwebtoken');
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7); // Extract the token without "Bearer "
  }
  next();
};

// JWT Verification Middleware
const verifyToken = (request, response, next) => {
  const secretKey = 'your-secret-key'; // Replace with your actual secret key

  // Check if the token exists in the request
  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' });
  }

  try {
    // Verify the token using your secret key
    const decodedToken = jwt.verify(request.token, secretKey);

    // You can then access the user ID or other relevant information from the token
    request.userId = decodedToken.userId; // Store the user ID in the request

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Token invalid' });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  verifyToken, // Include the JWT verification middleware
};
