// Sign up component
import "../css/SelectLanguage.css"
import NavigationBar from "../components/NavigationBar";
import { SetStateAction, useState, useEffect, MouseEvent } from "react"
import User from "../types/User";
import { Language } from "../types/Language";

export default function SelectLanguage({selected, setSelected, setFlowState}) {
  const isSelected = (item: SetStateAction<string>) => {
    setSelected(item);
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFlowState();
  };

  // Buttons of languages supported
  const languages_supported = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
  var rendered_languages = [languages_supported.map((item) =>
    <button className={`lang-unique-button ${item === selected ? "active" : ""}`}
      id={item}
      style={{ backgroundImage: `url(${require("../assets/flags/" + item + ".png")})` }}
      onClick={() => isSelected(item)}
    >
      <img className="lang-unique-flag"
        id={item + '-flag'}
        src={require("/src/assets/flags/" + item + ".png")}
        alt={item}>
      </img>
      <div className="lang-unique-text">{item}</div>
    </button>
  )];

  return (
    <>
      <p id="lang-select-instruction-title">Please select your target language.</p>
      <p id="lang-select-instruction-subtitle">Linguabot will communicate with you in this language!</p>

      <div id="lang-select">{rendered_languages}</div>
      <button id="continue-lang-select" onClick={handleSubmit}>CONTINUE</button>
    </>
  );
}
