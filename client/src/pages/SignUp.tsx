// Sign up component
import "../css/SignUp.css"

export default function SignUp() {
  const languages_supported = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
  var rendered_languages = [languages_supported.map(item => 
    <button className="lang-unique-button" id={item} style={{backgroundImage:`url("")`}}>
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
      <p id="lang-select-instruction-title">Please select your target language.</p>
      <p id="lang-select-instruction-subtitle">Linguabot will communicate with you in this language!</p>
      
      <div id="lang-select">{rendered_languages}</div>
      <button id="continue-lang-select">CONTINUE</button>
    </>
  );
}
