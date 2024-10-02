const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authentication in GraphQL context
  authMiddleware: function ({ req }) {
    // Token can be sent via headers
    let token = req.headers.authorization || '';

    // ["Bearer", "<tokenvalue>"]
    if (token.startsWith('Bearer ')) {
      token = token.split(' ').pop().trim();
    }

    // If no token, return the request as is without attaching a user
    if (!token) {
      return req;
    }

    try {
      // Verify token and extract user data
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach user data to the request
    } catch {
      console.log('Invalid token');
    }

    // Return the request object so Apollo can attach it to the context
    return req;
  },

  // Function to sign a token with user data
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};