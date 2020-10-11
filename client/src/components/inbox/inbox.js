import React,{useEffect} from 'react';
import classes from './inbox.module.css';
import Chat from './chat/chat';
function Inbox(props){
    useEffect(() => {
        setTimeout(()=>{
            var myElement = document.getElementById('top');
            var topPos = myElement.offsetTop;
            document.getElementById('scrolling_div').scrollTop = topPos;
        },10);
    });
    return(
        <div className={classes.inbox}>
            <div id="scrolling_div" className={classes.innerBox}>
                {props.chats.map((c,index)=>
                    <Chat c={c} key={index} index={index} sender={props.sender} />
                )}
                <div id="top" ></div>
            </div>
        </div>
    )
}

export default Inbox;