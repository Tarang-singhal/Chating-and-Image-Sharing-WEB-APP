import React from 'react';
import io from 'socket.io-client';
const socket = io();
class Form extends React.Component{
    state={
        message: "",
    }

    change = (event)=>{
        var message = event.target.value;
        this.setState({
          message: message,
        });
    }

    submit = (event)=>{
        event.preventDefault();
        console.log('hello');
        socket.emit('chat message',this.state.message);
    }

    render(){
        return(
        <form onSubmit={(event)=>this.submit(event)}>
            <input type="text"/>
            <input onChange={(event)=>this.change(event)} type="text"/>
            <button type="submit">Submit</button>
        </form>
        )
    }
}

export default Form;