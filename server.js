const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

var DATABASEURL = process.env.DATABASEURL || "mongodb://localhost/loan";
mongoose.connect(DATABASEURL,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>{
    console.log("Database connected!");
})
.catch((e)=>{
    console.log(`ERROR: ${e}`);
})

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.listen(PORT,()=>{
    console.log(`Listening on PORT: ${PORT}`);
});