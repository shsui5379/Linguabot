// Sign up component
import "../css/SignUp.css"
import NavigationBar from "../components/NavigationBar"; 
import { default as UserDatabase } from "../../../server/database/UserDatabase"; 
import { SetStateAction, useState, useEffect, MouseEvent } from "react"

export default function SignUp() {
  const [selected, setSelected] = useState(""); 
  const isSelected = (item: SetStateAction<string>) => {
    setSelected(item);
  } 

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const targetLanguage = { 
      sourceLanguage : "English", 
      targetLanguages : selected
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(targetLanguage),
      });

      const data = await response.json();
      // Handle success, update state, show notifications, etc. 
      console.log('Success:', data);
      
    } catch (error) {
      // Handle errors, show error messages, etc. 
      console.error('Error:', error);  
    } 
  };  



  const languages_supported = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
  var rendered_languages = [languages_supported.map((item) => 
    <button className={`lang-unique-button ${item===selected ? "active" : ""}`} 
            id={item} 
            style={{backgroundImage:`url(${require("../assets/flags/" + item + ".png")})`}}
            onClick={() => isSelected(item)}
      >
      <img className="lang-unique-flag" 
          id={item + '-flag'}
          src={require("/src/assets/flags/" + item +".png")}
          alt={item}>
      </img>
      <div className="lang-unique-text">{item}</div>
    </button>
  )];
  return(
  <>
    <NavigationBar />
    <p id="lang-select-instruction-title">Please select your target language.</p>
    <p id="lang-select-instruction-subtitle">Linguabot will communicate with you in this language!</p>
    
    <div id="lang-select">{rendered_languages}</div>
    <button id="continue-lang-select" onClick={handleSubmit}>CONTINUE</button>
  </>
  );
}
