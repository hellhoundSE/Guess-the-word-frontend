import React from 'react';

const GuessedChar = props =>{
    return(
        <div className="guessing-chars">
            <h3>{props.char}</h3>
        </div>
    )
}

export default GuessedChar;