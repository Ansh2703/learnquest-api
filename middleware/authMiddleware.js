const jwt = require('jsonwebtoken');

// Middleware is just a function that runs before our main route logic.
module.exports = (req, res, next) => {
  // We'll get the token from the request's 'Authorization' header.
  // It usually looks like: "Bearer [the_long_token_string]"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get just the token part

  if (token == null) {
    // If there's no token, the user isn't authorized.
    return res.sendStatus(401); 
  }

  // We'll verify the token is valid.
  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) {
      // If the token is invalid or expired, access is forbidden.
      return res.sendStatus(403);
    }
    // If the token is good, we'll attach the user's info to the request object
    // so that the next function (our main route) can use it.
    req.user = user;
    next(); // Move on to the next function in the chain.
  });
};