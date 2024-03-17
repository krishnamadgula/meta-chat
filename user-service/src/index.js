const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const loginRoute = require('./routes/login');
const config = require('../configs/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/login', loginRoute);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});