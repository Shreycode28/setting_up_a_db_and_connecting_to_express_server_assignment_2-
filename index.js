require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user'); // Import the User model

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.log(`Error connecting to database: ${err}`);
  });

// POST endpoint to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, age } = req.body;

    // Validate input
    if (!username || !email || !password || !firstName || !lastName || !age) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user based on the request data
    const newUser = new User({ username, email, password, firstName, lastName, age });

    // Save the user to the database
    await newUser.save();

    // Return success message
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
