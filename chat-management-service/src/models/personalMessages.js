const mongoose = require('mongoose');


const message = new mongoose.Schema({
    senderId: { type: String, required: true, index:{}},
    receiverId: { type: String, required: true, index:{} },
    content: {type: String, required:true},
    deliveredTime:{type:Date, default:null},
    sentTime:{type:Date, default:Date.now},
});

module.exports = mongoose.model('personalMessage', message);