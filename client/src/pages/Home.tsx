// Home component
import "../css/Home.css"
import NavigationBar from "../components/NavigationBar";
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
    <NavigationBar />
    {/** Title */}
      <div id="welcome-block">
        <div id="welcome-inner-block">
          <div id="welcome-inner-text">
            <h1 className="welcome-title" id="welcome-title-upper">CHATBOT</h1>
            <h2 className="welcome-title" id="welcome-title-lower">language partner</h2>
            <p id="welcome-subtitle">Improve your language fluency by chatting with Linguabot!</p>
          </div>
          <img id="welcome-image" alt="Robot welcome" src="https://kioku-space.com/images/chatbot.webp"></img> 
        </div>
      </div>

      {/** Languages Offered */}
      <div id="languages-offered">{displayed_languages}</div>

      {/** Major Feature Overview */}
      <div id="major-features">
        <h3 id="problem">Struggling to find a language practice partner?</h3>
        <p id="solution">Look no further! Linguabot uses GPT technology to help you practice 
                         <br></br>communication skills by simulating real-life conversations.</p>
        <div id="overview">
          <div id="feature-left">
            <p className="feature-title"><FontAwesomeIcon icon={faLanguage} /> Language Selection</p>
            <p className="feature-description">Select a target language <br></br>to practice with the bot!</p>
          </div>
          <div>
            <p className="feature-title"><FontAwesomeIcon icon={faRobot} /> AI Partner</p>
            <p className="feature-description">Linguabot will chat with <br></br> you only in your target language!</p>
          </div>
          <div id="feature-right">
            <p className="feature-title"><FontAwesomeIcon icon={faListCheck} /> Manage Conversations</p>
            <p className="feature-description">Create new conversations or <br></br>pick up from where you left off!</p>
          </div>
        </div>
      </div>

      {/** Highlighted Features */}
      <div id="feature-display">
        <div className="feature-highlight-overview">
          <img className="feature-image-left"
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
          <div className="feature-highlight-right">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Chat with Your Language Partner</p>
              <p className="feature-highlight-description">
                Linguabot will respond to your messages in your target language, regardless of any mistakes.
                Talk about any topic and ask it any questions! 
              </p>
            </div>
          </div>
        </div>
        <div className="feature-highlight-overview">
          <div className="feature-highlight-left">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Organize Your Conversations</p>
              <p className="feature-highlight-description">
                Start a new conversation, pick up from where you last left off, or remove a saved conversation! <br></br><br></br>
                You can save up to <b>10 chats</b> with each one lasting up to 30 days if it's not used. 
              </p>
            </div>
          </div>
          <img className="feature-image-right" 
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
        </div>
        <div className="feature-highlight-overview">
          <img className="feature-image-left"
               src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"
               alt="Feature"></img>
          <div className="feature-highlight-right">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Save Messages and Add Notes</p>
              <p className="feature-highlight-description">Want to save a message Linguabot sent? Add it to your favorites list
                and include a note if you'd like. You can go to your Notes page to look back at it later!</p>
            </div> 
          </div>
        </div>
      </div>

      {/** Register */}
      <div id="join-now">
        <div id="join-now-title">Improve your fluency with Linguabot!</div>
        <div id="join-now-subtitle">Don't wait any longer to find a language partner.</div>
        <a id="get-started-button"
          href="https://dev-3pimm2jcsp5tvdbf.us.auth0.com/authorize?response_type=code&client_id=0XZ78NoX2OqMXCuDRDrCNaFbjoO4PGlF&redirect_uri=http://localhost:8080/callback&prompt=login&screen_hint=signup" >
          GET STARTED   
        </a>
      </div>
    </>
  );
}
