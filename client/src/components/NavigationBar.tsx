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
        <Link className="navigation-right" to="/login">
          Log In
        </Link>
        <Link className="navigation-right" to="/signup">
          Sign Up
        </Link>
      </>
    );
  } else {
    navRight = (
      <>
        <Link
          className="navigation-right"
          to="/"
          onClick={() => onLogin(false)}
        >
          Sign Out
        </Link>
        <Link className="navigation-right" to="/chat">
          Chat Room
        </Link>
      </>
    );
  }

  return (
    <div className="navigation-menu">
      <Link className="navigation-left" to="/">
        Linguabot
      </Link>
      {navRight}
      <Link
        className="navigation-right"
        to="/home"
        onClick={() => onLogin(true)}
      >
        TEMPAUTH
      </Link>
    </div>
  );
}
