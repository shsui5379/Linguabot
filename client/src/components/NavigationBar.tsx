import { Link } from "react-router-dom";
import "../css/NavigationBar.css";

// Navigation bar component
// the isLoggedIn property is supposed to temporary simulate authentication. Remove it later
export default function NavigationBar({ isLoggedIn, onLogin }) {
  // Determine the correct things to display on the right side of the navigation bar
  let navRight = null;
  if (!isLoggedIn) {
    navRight = (
      <>
        <Link className={`${"navigation-right"} ${"center-link"} ${"rightmost-link"}`} to="/signup" >
          <p className="center-text" id="signup"> Sign Up </p>          
        </Link>
        <Link className={`${"navigation-right"} ${"center-link"}`} to="/login" >
          <p className="center-text" id="login"> Log In </p>
        </Link>
        
      </>
    );
  } else {
    navRight = (
      <>
        <Link
          className={`${"navigation-left"} ${"center-link"}`}
          to="/"
          onClick={() => onLogin(false)}
        >
          <p className="center-text" id="signout"> Sign Out </p>
        </Link>
        <Link className={`${"navigation-left"} ${"center-link"}`} to="/chat">
          <p className="center-text" id="chatroom"> Chat Room </p>
        </Link>
      </>
    );
  }

  return (
    <div className="navigation-menu">
      <Link 
        className={`${"navigation-left"} ${"center-link"}`} 
        id="logo"
        to="/"
      >
        Linguabot
      </Link>
      {navRight}
      <Link
        className={`${"navigation-right"} ${"center-link"}`}
        to="/home"
        onClick={() => onLogin(true)}
      >
        TEMPAUTH
      </Link>
    </div>
  );
}
