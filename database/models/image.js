const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    img:{ 
        data: Buffer, 
        contentType: String 
    },
    sender:Number,
    receiver:Number
});

module.exports = new mongoose.model('Image', imageSchema);