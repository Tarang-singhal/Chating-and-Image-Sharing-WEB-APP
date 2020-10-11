import React,{useState} from 'react';
import {TextField,Button} from '@material-ui/core';
import InputUser from "./components/inputUser/InputUser";
import Inbox from "./components/inbox/inbox"
import classes from './App.module.css';
import io from 'socket.io-client';
const socket = io.connect();
function App(props){
  const [chats,setChats] = useState([]);
  const [open,setOpen] = useState(true);
  const [currUser,setCurrUser] = useState('');
  const [userRef] = useState(React.createRef());
  const [ref2] = useState(React.createRef());
  const [ref3] = useState(React.createRef());

  const submit = (event) =>{
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

  const submit3 = (event) =>{
    event.preventDefault();
    var number = Number(ref2.current.value.trim());
    if(number<1000000000 || number>9999999999){
      alert("Invalid Friend number\nRange allowed:(1111111111-9999999999)");
      ref2.current.value='';
      ref3.current.value='';
      return;
    }else{
      socket.emit('friend',({phone:number}));
    }
    if(number===currUser){
      alert("Can't send on same number");
      ref2.current.value='';
      ref3.current.value='';
      return;
    }
    var message = ref3.current.value;
    ref3.current.value='';
    var arr = [...chats,{chat:message,sender:currUser,receiver:number}];
    setChats(arr);
    setTimeout(()=>{
      socket.emit('message',({chat:message}));
    },10);
  }

  // const submit4 = (event)=>{
  //   event.preventDefault();
  // }

  socket.on('addChats',(c)=>{
    var arr = [...c];
    setChats(arr);
  })
  socket.on('addChat',(c)=>{
    var arr = [...chats,c];
    setChats(arr);
  })

  return (
    <div>
      <InputUser submit={submit} Ref={userRef} open={open}/>
      <p className={classes.currUser}>
        {currUser}
      </p>
      <div className={classes.inputFriend}>
        <form className={classes.Form} onSubmit={submit3}>
          <TextField className={classes.friend} id="friend" size='small' required label="Friend no." placeholder="XXXXXXXXXX" inputProps={{type:"tel",minLength:10,maxLength:10,pattern:"[0-9]{10}"}} inputRef={ref2}/>
          <TextField required rows={2} className={classes.message_field} multiline label="message" variant='filled' inputRef={ref3}/>    
          <Button className={classes.send} color='primary' variant='contained' type="submit">Send</Button>
        </form>
        {/* <form onSubmit={submit4} encType='multipart/form-data'>
          <input required type="file" accept="image/jpeg, image/png, image/gif"/>
          <button type='submit'>submit</button>
        </form> */}
      </div>


      <Inbox chats={chats} sender={currUser}/>
    
    </div>
  );
}

export default App;
