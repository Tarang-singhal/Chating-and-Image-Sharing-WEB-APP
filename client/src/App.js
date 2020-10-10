import React,{useState} from 'react';
import {TextField,Button} from '@material-ui/core';
import InputUser from "./components/inputUser/InputUser"
import classes from './App.module.css';
import io from 'socket.io-client';
const socket = io.connect(`http://localhost:${process.env.PORT}/`);
function App(props){
  const [chats,setChats] = useState([]);
  const [open,setOpen] = useState(true);
  const [currUser,setCurrUser] = useState('');
  const [userRef] = useState(React.createRef());
  const [ref2] = useState(React.createRef());
  const [ref3] = useState(React.createRef());

  const submit = (event) =>{
    event.preventDefault();
    // console.log(number);
    var number = Number(userRef.current.value.trim());
    setCurrUser(number);
    socket.emit('addUser',({phone:number}));
    setOpen(false);
  }

  const submit2=(event)=>{
    event.preventDefault();
    var number = Number(ref2.current.value.trim());
    socket.emit('friend',({phone:number}));
  }

  const submit3 = (event) =>{

    var message = ref3.current.value;
    // console.log(number);
    socket.emit('message',({chat:message}));
    ref3.current.value='';
    setChats([...chats,message]);
  }

  socket.on('addChats',(c)=>{
    var arr = [...chats,...c];
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
      <div className={classes.Box} onSubmit={submit2}>
        <div className={classes.inputFriend}>
          <form className={classes.Form}>
            <TextField className={classes.friend} id="friend" size='small' required label="Friend no." placeholder="XXXXXXXXXX" inputProps={{type:"tel",minLength:10,maxLength:10,pattern:"[0-9]{10}"}} inputRef={ref2}/>
            <Button className={classes.send} color='primary' variant='contained' type="submit">Connect</Button>
          </form>
          <form className={classes.Form} onSubmit={submit3}>
            <TextField rows={4} className={classes.message_field} multiline label="message" variant='filled' inputRef={ref3}/>    
            <Button className={classes.send} color='primary' variant='contained' type="submit">Send</Button>
          </form>
        </div>
      </div>
      
      
      {chats.map((chat,index)=>
        <div key={index}> {chat} </div>
      )}
    </div>
  );
}

export default App;
