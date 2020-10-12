module.exports={     
    
        adduser:   (U)=>{

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

                        // send previous chats and images on the client side
                        var y = userFound.chats.map((chat)=>chat);

                        //sending chats
                        client.emit('addChats',y);

                        var z = userFound.images.map((image)=> {
                            return {buffer:image.img.data.toString('base64'),sender:image.sender,receiver:image.receiver};
                        });

                        //sending images
                        client.emit('addPhotos',z);
                        currUser=userFound;
                    });
                }
            });
        },



        

}