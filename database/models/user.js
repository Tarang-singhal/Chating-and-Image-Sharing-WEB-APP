const mongoose = require('mongoose');
var chats = require('./chat');
var images = require('./image'); 
var userScemha = new mongoose.Schema({
    id:String,
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
    }],
    images:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'images'
    }]
});

var User = mongoose.model('users',userScemha);

module.exports = User;