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
const { resolve } = require('path');
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


    client.on('friend',(obj)=>{
        // console.log(obj);
        new Promise((resolve,reject)=>{
            User.findOne(obj.f).populate('chats').exec((err,userFound)=>{
                if(!userFound){
                    User.create(obj.f,(err,newFriend)=>{
                        // console.log(newUser);
                        resolve(newFriend);
                    });
                }else{
                    resolve(userFound);
                }
            })
        }).then((friend)=>{
            c = obj.c;
            if(c.sender!==c.receiver){
                Chat.create(c,(err,newChat)=>{
                    currUser.chats.push(newChat);
                    friend.chats.push(newChat);
                    currUser.save();
                    friend.save()
                    .then(()=>{
                        client.to(friend.id).emit('addChat',c);
                    });
                });
            }}
        );
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