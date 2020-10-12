import React from 'react';
import classes from './photo.module.css';

function Photo(props){
    return(
        <>
            <div className={classes.tile}>
                <div className={classes.border}>
                    <div className={classes.image} style={{backgroundImage:`url(${props.src})`}}/>
                </div>
                <span className={classes.detail}>From {props.sender}</span>
            </div>
        </>
    );
}

export default Photo;