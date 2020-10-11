const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const cors = require('cors');
const { PORT } = require('./config/index');
const { success, error } = require('consola');
require('./database/connection');
const User = require('./database/models/user');
const Chat = require('./database/models/chat');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (client) => {
    var currUser;
    client.on('addUser',(U)=>{
        User.findOne(U).populate('chats').exec((err,userFound)=>{
            if(!userFound){
                var u = {...U};
                u.id = client.id;
                User.create(u,(err,newUser)=>{
                    // console.log(newUser);
                    currUser=newUser;
                });
            }else{
                // console.log(userFound.chats);
                userFound.id = client.id;
                userFound.save()
                .then(()=>{
                    var y = userFound.chats.map((chat)=>chat);
                    client.emit('addChats',y);
                    // console.log(userFound);
                    currUser=userFound;
                });
                
            }
        });
    });
    
    var friend;
    client.on('friend',async(f)=>{
        await User.findOne(f).populate('chats').exec((err,userFound)=>{
            if(!userFound){
                User.create(f,(err,newUser)=>{
                    // console.log(newUser);
                    friend = newUser;
                });
            }else{
                friend = userFound;
            }
        });

    });

    client.on('message',async (C)=>{
        await User.findOne({phone:friend.phone},(err,fri)=>{
            if(fri)
                friend = fri;
            else
                console.log('friend not find!');
        });
        var c = {...C};
        c.sender = currUser.phone;
        // console.log(friend);
        c.receiver = friend.phone;
        if(c.sender!==c.receiver){
            await Chat.create(c,(err,newChat)=>{
                currUser.chats.push(newChat);
                friend.chats.push(newChat);
                friend.save();
                currUser.save();
            });
            client.to(friend.id).emit('addChat',c);   
        }
    });

    client.on('disconnect', () => {
        // console.log('a user disconnected');
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