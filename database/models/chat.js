const mongoose = require('mongoose');

var chatScemha = new mongoose.Schema({
    chat: String,
    sender: String,
    receiver: String
});

var Chat = mongoose.model('chats',chatScemha);

module.exports = Chat;