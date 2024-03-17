const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index:{unique:true}},
    details:{type: Object, default:null},
    password: { type: String, required: true },
    isAdmin: {type:Boolean, default:false},
});

module.exports = mongoose.model('userSchema', userSchema);