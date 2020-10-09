const mongoose = require('mongoose');
var chats = require('./Chat');
var userScemha = new mongoose.Schema({
    name: String,
    phone:{
        type: Number,
        min: 1000000000,
        max: 9999999999,
        required: true
    },
    chats:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    }]
});

var User = mongoose.model('users',userScemha);

module.exports = User;