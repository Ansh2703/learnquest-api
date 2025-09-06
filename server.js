const express = require('express');
const cors = require('cors');
const db = require('./models');

// We're bringing in all our route files.
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // --- NEW: Importing user routes!

const app = express();

app.use(cors());
app.use(express.json());

// We're telling our server to use all the routes.
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // --- NEW: Using the user routes!

app.get('/api', (req, res) => {
  res.json({ message: 'Hey! The LearnQuest API is up and running!' });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Success! Our server is now live and listening on port ${PORT}.`);
});