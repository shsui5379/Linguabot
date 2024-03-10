// Home component
import "../css/Home.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage, faRobot, faListCheck } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <>
    {/** Title */}
      <div id="welcome-block">
        <div id="welcome-inner-block">
          <div id="welcome-inner-text">
            <h1 className="welcome-title" id="upper-title">CHATBOT</h1>
            <h2 className="welcome-title" id="lower-title">language partner</h2>
            <p id="welcome-subtitle">Improve your language fluency by chatting with Linguabot!</p>
          </div>
          <img id="welcome-image" src="https://kioku-space.com/images/chatbot.webp"></img> 
        </div>
      </div>

      {/** Languages Offered */}
      <div id="languages-offered">
        <p className="language margin-left">
          <img className="lang-flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Spain_%28Civil%29.svg/2560px-Flag_of_Spain_%28Civil%29.svg.png"></img>
          Spanish
        </p>
        <p className="language">
          <img className="lang-flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png"></img>
          French
        </p>
        <p className="language">
          <img className="lang-flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/255px-Flag_of_the_People%27s_Republic_of_China.svg.png"></img>
          Mandarin
        </p>
        <p className="language">
          <img className="lang-flag" id="japan" src="https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg"></img>
          Japanese
        </p>
        <p className="language margin-right">
          <img className="lang-flag" id="korea" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/1200px-Flag_of_South_Korea.svg.png"></img>
          Korean
        </p>
      </div>

      {/** Major Feature Overview */}
      <div id="major-features">
        <h3 id="problem">Struggling to find a language practice partner?</h3>
        <p id="solution">Look no further! Linguabot uses GPT technology to help 
                        you practice <br></br>communication skills by simulating real-life conversations.</p>
        <div id="overview">
          <div className="feature margin-left">
            <p className="feature-title"><FontAwesomeIcon icon={faLanguage} /> Language Selection</p>
            <p className="feature-description">Select a target language <br></br>to practice with the bot!</p>
          </div>
          <div className="feature">
            <p className="feature-title"><FontAwesomeIcon icon={faRobot} /> Bot Behavior</p>
            <p className="feature-description">Choose between conversation <br></br>or grammar mode!</p>
          </div>
          <div className="feature margin-right">
            <p className="feature-title"><FontAwesomeIcon icon={faListCheck} /> Manage Conversations</p>
            <p className="feature-description">Create new conversations or <br></br>pick up from where you left off!</p>
          </div>
        </div>
      </div>

      {/** Highlighted Features */}
      <div id="feature-display">
        <div className="feature-highlight-overview">
          <img className="feature-image float-left margin-left" src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"></img>
          <div className="feature-highlight float-right margin-right">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Customize Your Learning Partner</p>
              <p className="feature-highlight-description">Feature description in detail</p>
            </div>
          </div>
        </div>
        <div className="feature-highlight-overview">
          <div className="feature-highlight float-left margin-left">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Organize Your Conversations</p>
              <p className="feature-highlight-description">Feature description in detail</p>
            </div>
          </div>
          <img className="feature-image float-right margin-right" src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"></img>
        </div>
        <div className="feature-highlight-overview">
          <img className="feature-image float-left margin-left" src="https://ps.w.org/replace-image/assets/icon-256x256.png?rev=2587356"></img>
          <div className="feature-highlight float-right margin-right">
            <div className="inner-feature-highlight">
              <p className="feature-highlight-title">Feature 3</p>
              <p className="feature-highlight-description">Feature description in detail</p>
            </div> 
          </div>
        </div>
      </div>

      {/** Register */}
      <div id="join-now">
        <div id="join-now-title">Get Chatty!</div>
        <div id="join-now-subtitle">Join in on the buzz.</div>
      </div>
    </>
  );
}
