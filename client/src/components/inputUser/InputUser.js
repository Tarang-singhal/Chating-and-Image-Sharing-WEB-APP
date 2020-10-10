import React from 'react';
import classes from './InputUser.module.css';
import {TextField,Modal,Paper,Button} from '@material-ui/core';

function InputUser (props){
    return(
        <Modal className={classes.Modal} open={props.open}>
        <Paper elevation={3} className={classes.Paper}>
          <form className={classes.Form} onSubmit={(e)=>{props.submit(e)}}>
            <TextField inputRef={props.Ref} required label="Your number" placeholder="XXXXXXXXXX" inputProps={{type:"tel",minLength:10,maxLength:10,pattern:"[0-9]{10}"}}/>
            <p>
            <Button variant='contained' color='primary' type="submit">Submit</Button>
            </p>
          </form>
        </Paper>
      </Modal>
    )
}

export default InputUser;