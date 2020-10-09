const app = require('express')();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const cors = require('cors');
const User = require('./modals/User');
const { DATABASEURL, PORT } = require('./config/index');
const { success, error } = require('consola');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASEURL,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>{
    success("Database connected!");
})
.catch((e)=>{
    error(`ERROR: ${e}`);
})

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.post('/add-phone',(req,res)=>{
    User.findOne({phone:req.body.phone},(err,userFound)=>{
        if(!userFound){
            User.create(req.body)
            .then((newUser)=>{
                res.json({message: 'new user added',newUser});
            })
            .catch((e)=>{
                res.json(e);
            });
        }else{
            res.status(200).json({message: 'user exist',userFound});
        }
    })
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
















if(process.env.NODE_ENV==="production"){
    app.use(express.static("client/build"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

server.listen(PORT,() =>
    success( `Listening on PORT: ${PORT}`)
);