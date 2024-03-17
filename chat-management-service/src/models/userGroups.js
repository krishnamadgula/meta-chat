const mongoose = require('mongoose');
const userGroups = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required:true },
    groups: [{ type: mongoose.Schema.Types.ObjectId }],
});
module.exports = mongoose.model('userGroup', userGroups);
