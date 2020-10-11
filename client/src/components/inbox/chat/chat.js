import React from 'react';
import classes from './chat.module.css';

function Chat(props){
    return(
        <>
            {
                Number(props.c.sender)===Number(props.sender)?
                    <li key={props.index} className={classes.send} > 
                        <span className={classes.user}>me to {props.c.receiver}</span>
                        <span>{props.c.chat}</span> 
                    </li>
                    :
                    <li key={props.index} className={classes.receive}>
                        <span className={classes.user}>{props.c.sender}</span>
                        <span>{props.c.chat}</span>
                    </li>
            }
        </>
    );
}

export default Chat;