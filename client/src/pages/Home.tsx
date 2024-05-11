// Home component
import "../css/Home.css"
import "../css/index.css"
import NavigationBar from "../components/NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage, faRobot, faUser } from '@fortawesome/free-solid-svg-icons'
import useRegistrationCheck from "../hooks/useRegistrationCheck"; 
import handleGetStartedCheck from "../hooks/useGetStartedButton"; 

export default function Home() {
  useRegistrationCheck();

  // Used to display flags of supported languages 
  const languages = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];

  let displayedLanguages = languages.map((item) =>
    <p className="language" id={item + "-home"}>
      <img className="lang-flag"
           id={item + "-home-flag"}
           src={require("/src/assets/flags/" + item +".png")}
           alt={item}></img>
      {item}
    </p>
  );
  
  return (
    <>
    <NavigationBar />
    {/** Title */}
      <div id="welcome-block">
        <div id="welcome-inner-block">
          <div id="welcome-inner-text">
            <h1 id="welcome-title-upper">CHATBOT</h1>
            <h2 id="welcome-title-lower">language partner</h2>
            <p id="welcome-subtitle">Improve your language fluency by chatting with Linguabot!</p>
          </div>
          <img id="welcome-image" alt="Robot welcome" src="https://kioku-space.com/images/chatbot.webp"></img> 
        </div>
      </div>

      {/** Languages Offered */}
      <div id="languages-offered">{displayedLanguages}</div>

      {/** Major Feature Overview */}
      <div id="major-features">
        <h1>Struggling to find a language practice partner?</h1>
        <p className="gray-text">Look no further! Linguabot uses GPT technology to help you practice 
                        <br></br>communication skills by simulating real-life conversations.</p>
        <div id="overview">
          <div className="overview-feature">
            <p><FontAwesomeIcon icon={faUser} /><b> Your Account</b></p>
            <span>Create a new account or <br></br>log in if you already have one!</span>
          </div>
          <div className="overview-feature">
            <p><FontAwesomeIcon icon={faLanguage} /><b> Language Selection</b></p>
            <span>Select a target language <br></br>to practice with the bot!</span>
          </div>
          <div className="overview-feature">
            <p><FontAwesomeIcon icon={faRobot} /><b> AI Partner</b></p>
            <span>Linguabot will chat with <br></br>you only in your target language!</span>
          </div>
        </div>
      </div>

      {/** Highlighted Features */}
      <div id="feature-display">
        <div className="feature-highlight-overview left">
          <img className="feature-image"
               src={require("../assets/features/chat.png")}
               alt="Feature"></img>
            <div className="feature-highlight">
              <h1>Chat with Your Language Partner</h1>
              <p className="gray-text">
                Linguabot will respond to your messages in your target language, regardless of any mistakes.
                Talk about any topic and ask it any questions! 
              </p>
            </div>
        </div>
        <div className="feature-highlight-overview right">
          <img className="feature-image" 
                src={require("../assets/features/saved-conversations.png")}
                alt="Feature"></img>
            <div className="feature-highlight">
              <h1>Organize Your Conversations</h1>
              <p className="gray-text">
                Start a new conversation, pick up from where you last left off, or remove a saved conversation! <br></br><br></br>
                You can save up to <b>10 chats</b> with each one lasting up to 30 days if it's not used. 
              </p>
            </div> 
        </div>
        {/* <div className="feature-highlight-overview">
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
        </div> */}
      </div>

      {/** Register */}
      <div id="join-now">
        <h1>Improve your fluency with Linguabot!</h1>
        <p>Don't wait any longer to find a language partner.</p>
        <button id="get-started-button"
          onClick={handleGetStartedCheck}>
          GET STARTED   
        </button>
      </div>
    </>
  );
}
