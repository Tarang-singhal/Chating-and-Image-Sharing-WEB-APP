// Required pacakages and files
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const cors = require('cors');
const { PORT } = require('./config/index');
const { success } = require('consola');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Models 
const User = require('./database/models/user');
const Chat = require('./database/models/chat');
const Image = require('./database/models/image');

// connection to mongoDB Cluster
require('./database/connection');

//Runs when a user connects
io.on('connection', (client) => {
    var currUser;

    // function for adding/finding a connected user/newUser.
    client.on('addUser',(U)=>{

        //finding user in database using his phone number
        User.findOne(U).populate('images').populate('chats').exec((err,userFound)=>{
            if(!userFound){
                var u = {...U};
                u.id = client.id;
                //creating newUser if it is not present
                User.create(u,(err,newUser)=>{
                    currUser=newUser;
                    console.log(currUser);
                });
            }else{
                // if present
                userFound.id = client.id;
                userFound.save()
                .then(()=>{
                    currUser=userFound;

                    // send previous chats and images on the client side
                    var y = userFound.chats.map((chat)=>chat);

                    //sending chats
                    client.emit('addChats',y);

                    var z = userFound.images.map((image)=> {
                        return {buffer:image.img.data.toString('base64'),sender:image.sender,receiver:image.receiver};
                    });

                    //sending images
                    client.emit('addPhotos',z);
                });
            }
        });
    });

    //this will add/find the friend entered by current user
    //to whom the chat has to be send
    client.on('friend',(obj)=>{
        new Promise((resolve,reject)=>{
            //finding friend in database
            User.findOne(obj.f).populate('chats').exec((err,userFound)=>{
                if(!userFound){
                    //if not found create a friend
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

                //creating chat
                Chat.create(c,(err,newChat)=>{
                    currUser.chats.push(newChat);
                    friend.chats.push(newChat);
                    currUser.save();
                    friend.save()
                    .then(()=>{

                        // sending chat to friend
                        client.to(friend.id).emit('addChat',c);
                    });
                });
            }}
        );
    });

    //this will recieve image from currUser
    //and save it to databse then send to friend
    client.on('image', async imag => {
        new Promise((resolve,reject)=>{

            //finding friend
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

            //getting image buffer
            const buffer = Buffer.from(imag.b, 'base64');

            //making image object
            var obj = {
                contentType: 'image/jpeg',
                receiver:imag.receiver,
                sender: imag.sender,
            };
            
            //editing image object
            fs.writeFile('./images/image', buffer,(err)=>{
                obj = {
                    ...obj,
                    img: {
                        data: fs.readFileSync('./images/image'), 
                        
                    }
                };

                //saving image in database
                Image.create(obj,(err,image)=>{
                    if(err){
                        console.log(err);
                    }
                    friend.images.push(image);
                    friend.save();

                    //sending image to friend
                    client.to(friend.id).emit('addPhoto',{buffer:image.img.data.toString('base64'),sender:image.sender,receiver:image.receiver});
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