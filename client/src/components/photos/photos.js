import React from 'react';
import classes from './photos.module.css';
import Photo from './photo/photo';
function Inbox(props){
    return(
        <div className={classes.box}>
            <div id='scroll_div' className={classes.innerBox}>
                {
                    props.photos.map((photo,index)=>{
                        var src = `data:image/jpg;base64,${photo.buffer}`;
                        return <Photo key={index} sender={photo.sender} src={src} />
                    })
                }
            </div>
        </div>
    )
}

export default Inbox;