import React from 'react';
import classes from './form.module.css';
import {TextField,Button} from '@material-ui/core';
function Form(props){
    return(
        <div className={classes.inputFriend}>
            <form className={classes.Form} onSubmit={props.submit3}>
                <TextField aria-autocomplete='none' className={classes.friend} id="friend" size='small' required label="Friend no." placeholder="XXXXXXXXXX" inputProps={{type:"tel",min:1111111111,minLength:10,maxLength:10,pattern:"[0-9]{10}"}} inputRef={props.ref2}/>
                <TextField required rows={2} className={classes.message_field} multiline label="message" variant='filled' inputRef={props.ref3}/>
                <Button className={classes.send} color='primary' variant='contained' type="submit">Send</Button>
            </form>
                <form onSubmit={(e)=>{e.preventDefault()}} className={classes.Form}>
                <button className={classes.sendImage} style={{marginTop:'10px',}}><label htmlFor="image">Send Image</label></button>
                <input onChange={props.imageHandler} style={{opacity:0,width:'1px'}} required id='image' type="file" accept="image/jpeg, image/png, image/gif"/>
            </form>
        </div>
    )
}

export default Form;