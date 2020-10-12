import React,{useState} from 'react';
import InputUser from "./components/inputUser/InputUser";
import Form from './components/Form/form';
import Inbox from "./components/inbox/inbox";
import Photos from './components/photos/photos';
import Bar from './components/bar/bar';
import classes from './App.module.css';
import io from 'socket.io-client';
const socket = io.connect();
function App(props){
  const [chats,setChats] = useState([]);
  const [photos,setPhotos] = useState([]);
  const [open,setOpen] = useState(true);
  const [showChat,setShowChat] = useState(true);
  const [currUser,setCurrUser] = useState('');
  const [userRef] = useState(React.createRef());
  const [ref2] = useState(React.createRef());
  const [ref3] = useState(React.createRef());
  
  const addNewUser = (event) =>{
    event.preventDefault();
    var number = Number(userRef.current.value.trim());
    if(number<1000000000 || number>9999999999){
      alert("Invalid number\nRange allowed:(1111111111-9999999999)");
      userRef.current.value='';
      return;
    }
    setCurrUser(number);
    socket.emit('addUser',({phone:number}));
    setOpen(false);
  }

  const sendChat = (event) =>{
    event.preventDefault();
    var number = Number(ref2.current.value.trim());
    if(number<1000000000 || number>9999999999 || number===currUser){
      alert("Invalid Friend number or Same number Error\nRange allowed:(1111111111-9999999999)");
      ref2.current.value='';
      ref3.current.value='';
      return;
    }
    var message = ref3.current.value.trim();
    socket.emit('friend',({f:{phone:number},c:{chat:message,sender:currUser,receiver:number}}));
    var arr = [...chats,{chat:message,sender:Number(currUser),receiver:number}];
    setChats(arr);
    ref3.current.value='';
  }
  const imageHandler = (event)=>{
    var x = document.getElementById('image');
      var number = Number(ref2.current.value.trim());
      if(!number || number<1000000000 || number>9999999999 || number===currUser){
        alert("Invalid Friend number or Same number Error\nRange allowed:(1111111111-9999999999)");
        ref2.current.value='';
        ref3.current.value='';
        return;
      }
      const reader = new FileReader();
      reader.onload = function() {
        const base64 = this.result.replace(/.*base64,/, '');
        socket.emit('image', {b:base64,sender:Number(currUser),receiver:number});
      };
      reader.readAsDataURL(x.files[0]);
  }

  var arrChats = [];
  socket.on('addChats',(c)=>{
    arrChats = [...c];
    // console.log(arrChats);
  });
  socket.on('addPhotos',(p)=>{
    var arrPhotos = [...p];
    setChats(arrChats);
    setPhotos(arrPhotos);
  });
  socket.on('addChat',(c)=>{
    var arr = [...chats,c];
    setChats(arr);
  });
  socket.on('addPhoto',(image)=>{ 
    var arrPhotos = [...photos,image];
    setPhotos(arrPhotos);
  });
  const handleChange1 = ()=>{
    setShowChat(true);
  };
  const handleChange2 = ()=>{
    setShowChat(false);
  };

  return (
    <div>
      <InputUser submit={addNewUser} Ref={userRef} open={open}/>
      <p className={classes.currUser}>{currUser}</p>
      <Form submit3={sendChat} imageHandler={imageHandler} ref2={ref2} ref3={ref3} />
      <Bar showChat={showChat} handleChange2={handleChange2} handleChange1={handleChange1}/>

      {
        showChat?
        <Inbox chats={chats} sender={currUser}/>
        :
        <Photos photos={photos} />
      }

    </div>
  );
}

export default App;
