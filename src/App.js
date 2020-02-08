import React, { useState } from "react";
import GuessedChar from "./guessing/guessedChar";
import AlphabetChar from "./guessing/alhpabetChar";
import LoginComponent from "./login/loginCompnent";
import "./App.css";

const App = props => {

  async function doGetRequest(url) {
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8080/api/" + url);

    request.addEventListener("load", function() {
      if (request.status === 200) {
        console.log(request.response);
        wordStateChanger({
          originalWord :request.response,
          word: request.response.split("").map((value, index) => {
            return {
              char: value,
              visible: false,
              index: index
            };
          })
        });
      }
    });
    request.send();
    return request;
  }

  const [winState, winStateChanger] = useState(false);
  const [nameState, nameStateChanger] = useState({
    name: "",
    isValid: false
  });
  const [languageState, languageStateChanger] = useState("ENG");
  const [livesState, livesStateChanger] = useState(0);
  const [wordState, wordStateChanger] = useState({
    word: []
  });

  const checkForWin = () =>
    wordState.word.filter(char => char.visible).length === wordState.word.length
      ? (winStateChanger(true), sendResult(true))
      : null;

  const sendResult = (result) => {
    let message = result?"You win":"You lose";
    alert(message);
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:8080/api/result");
    var data = new FormData();
    data.append('name', nameState.name);
    data.append('word', wordState.originalWord);
    data.append('win', result);
    request.send(data);
  };

  const guessClickHandler = pressedChar =>
    wordState.word
      .filter(char => char.char === pressedChar)
      .map(char => {
        const correctLetter = wordState.word;
        correctLetter[char.index].visible = true;
        wordStateChanger({
          originalWord : wordState.originalWord,
          word: correctLetter
        });
      }).length === 0
      ? checkForLose() : checkForWin();

  const checkForLose = () => {
    livesStateChanger(livesState - 1);
    if(livesState === 1){
      sendResult(false)
    }

  }
  const startGame = () => {
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:8080/api/player/" + nameState.name);
    request.send();
    winStateChanger(false);
    livesStateChanger(7);
  };

  const startHandler = values => {
    if (nameState.name !== "") {
      const form = values.target;
      const lg = form.elements[1].checked ? "ENG" : "RUS";
      languageStateChanger(lg);
      doGetRequest("languages/" + lg);

      nameStateChanger({ ...nameState, isValid: true });
      startGame();
    }
  };

  const nameChangeHandler = event => {
    nameStateChanger({
      ...nameState,
      name: event.target.value
    });
  };

  return (
    <div>
      {!nameState.isValid || livesState === 0 || winState ? (
        <div className="login">
          <LoginComponent
            defaultName={nameState.name}
            startHandler={startHandler}
            nameChangeHandler={nameChangeHandler}
          ></LoginComponent>
        </div>
      ) : (
        <div>
          <h3 className="lives-block">Lives : {livesState}</h3>
          <div className="guessing-block">
            {wordState.word.map(value => {
              return value.visible ? (
                <GuessedChar key={value.index} char={value.char} />
              ) : (
                <GuessedChar key={value.index} char="_" />
              );
            })}
          </div>
          <div className="chars-block">
            {getAlphabet(languageState).map((value, index) => (
              <AlphabetChar
                key={index}
                onClickHandler={guessClickHandler.bind(this, value)}
                char={value}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getAlphabet = lang => {
  switch (lang) {
    case "ENG": {
      const arr = [];
      for (let i = 0; i <= 25; i++) {
        arr[i] = String.fromCharCode(97 + i);
      }
      return arr;
    }
    case "RUS": {
      const arr = [];
      for (let i = 0; i <= 31; i++) {
        arr[i] = String.fromCharCode(1072 + i);
      }
      return arr;
    }
    default:
      return null;
  }
};

export default App;
