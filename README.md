# Chating-and-Image-Sharing-WEB-APP

This ia an Online chatting app with Image Sending feature.

This app uses socket.io and socket.io-cleient for real time communication between
server and client.

## server.js

This app uses mongoose for making mongoDB schema's of user, chat and image (Models present in database folder).
For database, it uses an online mongoDB cluster (connection file is in database folder).

### *server.js* file has 3 socket events - _addUser, friend and image_.

*addUser* event will be invoked whenever a new/existed user details entered on the client side
if the user exists then, all it's chats and images will be sent to client side.

*friend* event will be invoked when current user start chating with his friend whose details has been entered
and save the chats in database and also if friend is online then, it will send it to the friend's side.
If friend is not online then, it will save the chats in database and whenever the friend becomes online then,
_addUser_ event will send those chats to it's side.

*image* event will be invoked when an image send.
In the callback of this event, the image will saved in databse and send to friend if he is online.


### *databse folder* - it contains models and connection file for databse

### *client folder* - it is a react app made using command _npm create-react-app client_








