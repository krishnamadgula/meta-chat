const mongoose = require('mongoose');


const groupMessage = new mongoose.Schema({
    senderId: { type: String, required: true, index:{}},
    groupId: { type: String, required: true, index:{} },
    content: {type: String, required:true},
    sentTime:{type:Date, default:Date.now},
});

module.exports = mongoose.model('groupMessages', groupMessage);