const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating user tokens

// --- REGISTRATION ROUTE ---
// URL: /api/auth/register
router.post('/register', async (req, res) => {
  // First, we get the username, email, and password from the user's request.
  const { username, email, password } = req.body;

  try {
    // We'll use bcrypt to create a "hash" of the user's password.
    // This is a secure, one-way encryption.
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Now, we create the new user in our database with the hashed password.
    const newUser = await db.users.create({
      username,
      email,
      password: hashedPassword
    });

    // We'll send back a success message.
    res.status(201).json({ message: 'Success! User created.', userId: newUser.id });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Oh no! Something went wrong.' });
  }
});


// --- LOGIN ROUTE ---
// URL: /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, let's find the user in the database who has this email.
    const user = await db.users.findOne({ where: { email: email } });

    // If we couldn't find a user with that email, it's an error.
    if (!user) {
      return res.status(404).json({ message: 'Sorry, we couldn\'t find that user.' });
    }

    // If we found the user, we'll compare the password they submitted
    // with the hashed password we have stored in the database.
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, that's another error.
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If the passwords DO match, we'll create a JSON Web Token (JWT).
    // This token is like a temporary keycard that proves the user is logged in.
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(
      payload,
      'your_jwt_secret_key', // This should be a secret key stored in your .env file!
      { expiresIn: '1h' } // The keycard expires in 1 hour.
    );

    // Finally, we send the token back to the user.
    res.json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Oh no! Something went wrong.' });
  }
});


module.exports = router;