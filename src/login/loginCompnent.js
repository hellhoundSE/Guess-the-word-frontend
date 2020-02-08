import React from "react";

const LoginComponent = props => {
  return (
    <div>
      <form onSubmit={props.startHandler}>
        <h3>Please write your name</h3>
        <input type="text" onChange={props.nameChangeHandler} value={props.defaultName}></input><br/>
        <input type="radio" name="language" value="ENG" defaultChecked/>English<br/>
        <input type="radio" name="language" value="RUS"/>Russian<br/>
        <button type="submit" name="button" value="Submit">start</button>
      </form>
    </div>
  );
};

export default LoginComponent;
