import React from 'react';
import "../App.css"
const AlphabetChar = props =>{
    return(
        <div className="chars" letter ={props.char} onClick={props.onClickHandler}>
            <h3>{props.char}</h3>
        </div>
    )
}

export default AlphabetChar;