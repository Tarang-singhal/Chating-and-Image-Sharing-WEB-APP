const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const cors = require('cors');
const { PORT } = require('./config/index');
const { success } = require('consola');
const fs = require('fs');
const multer = require('multer');
require('./database/connection');
const User = require('./database/models/user');
const Chat = require('./database/models/chat');
const Image = require('./database/models/image');
const { Socket } = require('net');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
var upload = multer({ storage: storage }); 

io.on('connection', (client) => {
    var currUser;

    client.on('addUser',(U)=>{
        User.findOne(U).populate('chats').exec((err,userFound)=>{
            if(!userFound){
                var u = {...U};
                u.id = client.id;
                User.create(u,(err,newUser)=>{
                    currUser=newUser;
                });
            }else{
                userFound.id = client.id;
                userFound.save()
                .then(()=>{
                    var y = userFound.chats.map((chat)=>chat);
                    client.emit('addChats',y);
                    currUser=userFound;
                });
                
            }
        });
    });

    client.on('friend',(obj)=>{
        new Promise((resolve,reject)=>{
            User.findOne(obj.f).populate('chats').exec((err,userFound)=>{
                if(!userFound){
                    User.create(obj.f,(err,newFriend)=>{
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

    client.on('image', async imag => {
        new Promise((resolve,reject)=>{
            User.findOne({phone:imag.receiver}).exec((err,userFound)=>{
                if(!userFound){
                    User.create(imag.receiver,(err,newFriend)=>{
                        resolve(newFriend);
                    });
                }else{
                    resolve(userFound);
                }
            })
        }).then((friend)=>{
            const buffer = Buffer.from(imag.b, 'base64');
            var obj = {
                contentType: 'image/jpeg',
                receiver:imag.receiver,
                sender: imag.sender,
            };
            fs.writeFile('./images/image', buffer,(err)=>{
                obj = {
                    ...obj,
                    img: {
                        data: fs.readFileSync('./images/image'), 
                        
                    }
                };
                Image.create(obj,(err,item)=>{
                    if(err){
                        console.log(err);
                    }
                    currUser.images.push(item);
                    currUser.save();
                    friend.images.push(item);
                    friend.save();
                    console.log('done!');
                    client.to(friend.id).emit('getImage',item.img.data.toString('base64'));
                });
            });
        })
        
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