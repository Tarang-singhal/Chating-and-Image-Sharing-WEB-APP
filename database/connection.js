const mongoose = require('mongoose');
const { DATABASEURL} = require('../config/index');

module.exports = mongoose.connect(DATABASEURL,({
                    useUnifiedTopology:true,
                    useNewUrlParser:true
                }))
.then(()=>{
    console.log("Database Connected!");
})
.catch((e)=>{
    console.log("Unable to connect Database!");
})

