const express = require('express');
const mongoose = require('mongoose');
const groupChatRoutes = require('./routes/groupChat');
const personalChatRoutes = require('./routes/personalChat');
const config = require('../configs/config');
const morgan = require('morgan');



const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json());
// Middleware to log requests
app.use(morgan('dev'));

// Your routes and other middleware...

// Middleware to log responses
app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
        console.log(`Response for ${req.method} ${req.url}:`, res.statusCode);
        originalSend.call(this, data);
    };

    next();
});

// Routes
app.use('/personal-chat', personalChatRoutes);
app.use('/group-chat', groupChatRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});