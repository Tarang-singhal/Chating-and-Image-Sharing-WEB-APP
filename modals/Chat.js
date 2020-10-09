const mongoose = require('mongoose');

var chatScemha = new mongoose.Schema({
    message: String,
    recieved: Boolean,
});

var Chat = mongoose.model('chats',chatScemha);

module.exports = Chat;