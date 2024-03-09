// Home component
import "../css/Home.css"
export default function Home() {
  return (
    <>
      <div id="welcome-block">
        <div id="welcome-inner-text">
          <h1 className="welcome-title" id="upper-title">CHATBOT</h1>
          <h2 className="welcome-title" id="lower-title">language partner</h2>
          <p id="welcome-subtitle">Improve your language fluency by chatting with an AI partner!</p>
        </div>
        <img id="welcome-image"></img> 
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
    </>
  );
}
