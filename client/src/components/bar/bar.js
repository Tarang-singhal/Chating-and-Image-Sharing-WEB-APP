import React from 'react';
import classes from './bar.module.css';
function Bar(props){
    return(
        <div className={classes.bar}>
        <ul>
          {
            props.showChat?
              <>
                <li className={classes.white}><button onClick={props.handleChange1} className={classes.button}>Recent Chats</button></li>
                <li className={classes.gray}><button onClick={props.handleChange2} className={classes.button}>Received Images</button></li>
              </>
            :
              <>
                <li className={classes.gray}><button onClick={props.handleChange1} className={classes.button}>Recent Chats</button></li>
                <li className={classes.white}><button onClick={props.handleChange2} className={classes.button}>Received Images</button></li>
              </>
          }
        </ul>
      </div>
    )
}

export default Bar;