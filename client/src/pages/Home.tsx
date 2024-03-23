// Home component
import "../css/Home.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage, faRobot, faListCheck } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  /** Used to display flags of supported languages */
  const languages = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
  var displayed_languages = [languages.map(item => 
    <p className="language" id={item + "-home"}>
      <img className="lang-flag" 
           id={item + "-home-flag"}
           src={require("/src/assets/flags/" + item +".png")}
           alt={item}></img>
      {item}
    </p>
  )];
  
  return (
    <>
    {/** Title */}
      <div id="welcome-block">
        <div id="welcome-inner-block">
          <div id="welcome-inner-text">
            <h1>CHATBOT</h1>
            <h2>language partner</h2>
            <p>Improve your language fluency by chatting with Linguabot!</p>
          </div>
          <img alt="Robot welcome" src="https://kioku-space.com/images/chatbot.webp"></img> 
        </div>
      </div>

      {/** Languages Offered */}
      <div id="languages-offered">{displayed_languages}</div>

      {/** Major Feature Overview */}
      <div id="major-features">
        <h3>Struggling to find a language practice partner?</h3>
        <p>Look no further! Linguabot uses GPT technology to help you practice 
                         <br></br>communication skills by simulating real-life conversations.</p>
        <div id="overview">
          <div className="margin-left">
            <h4><FontAwesomeIcon icon={faLanguage} /> Language Selection</h4>
            <p>Select a target language <br></br>to practice with the bot!</p>
          </div>
          <div>
            <h4><FontAwesomeIcon icon={faRobot} /> Bot Behavior</h4>
            <p>Choose between conversation <br></br>or grammar mode!</p>
          </div>
          <div className="margin-right">
            <h4><FontAwesomeIcon icon={faListCheck} /> Manage Conversations</h4>
            <p>Create new conversations or <br></br>pick up from where you left off!</p>
          </div>
        </div>
      </div>

      {/** Highlighted Features */}
      <div id="feature-display">
        <div className="feature-highlight-overview">
          <img className={`${"float-left"} ${"margin-left"}`} 
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
          <div className={`${"feature-highlight"} ${"float-right"} ${"margin-right"}`}>
            <div>
              <h3>Customize Your Learning Partner</h3>
              <p>
                <b>Conversational Mode:</b> Linguabot will respond to your messages in your target language, regardless of any mistakes!
                Talk about any topic and ask it any questions! <br></br><br></br>

                <b>Correctional Mode:</b> Improve your grammar and spellling! Linguabot will provide you feedback for any mistakes.
              </p>
            </div>
          </div>
        </div>
        <div className="feature-highlight-overview">
          <div className={`${"feature-highlight"} ${"float-left"} ${"margin-left"}`}>
            <div>
              <h3>Organize Your Conversations</h3>
              <p>
                Start a new conversation, pick up from where you last left off, or remove a saved conversation! <br></br><br></br>
                You can save up to <b>10 chats</b> with each one lasting up to 30 days if it's not used. 
              </p>
            </div>
          </div>
          <img className={`${"float-right"} ${"margin-right"}`} 
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
        </div>
        <div className="feature-highlight-overview">
          <img className={`${"float-left"} ${"margin-left"}`} 
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
          <div className={`${"feature-highlight"} ${"float-right"} ${"margin-right"}`}>
            <div>
              <h3>Feature 3</h3>
              <p>Feature description in detail</p>
            </div> 
          </div>
        </div>
      </div>

      {/** Register */}
      <div id="join-now">
        <h3>Improve your fluency with Linguabot!</h3>
        <h4>Don't wait any longer to find a language partner.</h4>
        <Link id="button" to="/signup">
          <p>GET STARTED</p>          
        </Link>
      </div>
    </>
  );
}
