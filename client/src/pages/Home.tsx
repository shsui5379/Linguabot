// Home component
import "../css/Home.css"
export default function Home() {
  return (
    <>
      <div id="welcome-block">
        <div id="welcome-inner-block">
          <div id="welcome-inner-text">
            <h1 className="welcome-title" id="upper-title">CHATBOT</h1>
            <h2 className="welcome-title" id="lower-title">language partner</h2>
            <p id="welcome-subtitle">Improve your language fluency by chatting with an AI partner!</p>
          </div>
          <img id="welcome-image" src="https://kioku-space.com/images/chatbot.webp"></img> 
      </div>
      </div>
      <div id="major-features">
        <h3 id="problem">Problem Statement</h3>
        <p id="solution">Solution and Goal</p>
        <div id="overview">
          <div className="feature">
            <i></i>
            <p className="feature-title">Feature</p>
            <p className="feature-description">Feature description</p>
          </div>
          <div className="feature">
            <i></i>
            <p className="feature-title">Feature</p>
            <p className="feature-description">Feature description</p>
          </div>
          <div className="feature">
            <i></i>
            <p className="feature-title">Feature</p>
            <p className="feature-description">Feature description</p>
          </div>
        </div>
      </div>
      <div id="feature-display">
        <div className="feature-highlight-overview image-left">
          <div className="feature-highlight">
            <p className="feature-highlight-title">Feature 1</p>
            <p className="feature-highlight-description">Feature description in detail</p>
          </div>
        </div>
        <div className="feature-highlight image-right">
          <div className="feature-highlight">
            <p className="feature-highlight-title">Feature 2</p>
            <p className="feature-highlight-description">Feature description in detail</p>
          </div>
        </div>
        <div className="feature-highlight image-left">
          <div className="feature-highlight">
            <p className="feature-highlight-title">Feature 3</p>
            <p className="feature-highlight-description">Feature description in detail</p>
          </div>
        </div>
      </div>
    </>
  );
}
