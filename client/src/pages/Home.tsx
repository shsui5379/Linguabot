// Home component
import "../css/Home.css"
export default function Home() {
  return (
    <>
      <div id="welcome-block">
        <img id="welcome-image"></img>
        <h1 id="welcome-title">WELCOME!!!</h1>
        <h2 id="welcome-subtitle">Something very catchy!!!</h2>
      </div>
      <div id="major-features">
        <p id="problem">Problem Statement</p>
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
