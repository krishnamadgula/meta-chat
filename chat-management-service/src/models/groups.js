const mongoose = require('mongoose');

// group and the members of the group
const group = new mongoose.Schema({
    name: { type: String, required: true},
    users: [{ type: mongoose.Schema.Types.ObjectId }],
    // timestamp: {type:Date, required:true},
});

// participant is part of what all groups


module.exports = mongoose.model('group', group);