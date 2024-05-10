import { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";  
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Navigation bar component
export default function NavigationBar() {
  const [isLinkShown, setIsLinkShown] = useState(false);
  // Determine the correct things to display on the right side of the navigation bar
  let navRight = null; 

  // Redirect users to the Auth0 login page
  const handleLogin = () => {
    window.location.href = '/login';
  };  

  const handleSignUp = () => {
    window.location.href = "/signup"
  }

  const handleLogout = () => {
    window.location.href = '/logout'; 
  }
 
  // Set login status to false initally 
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Set logged in status after callback from login
  useEffect(() => { 
    async function fetchLoginStatus() {
      try {
        const response = await fetch('/status');
        const data =  await response.text(); 
        if (data === 'Logged in') {
          setLoggedIn(true); 
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
        setLoggedIn(false); // Default to false if there's an error
      }
    } 
    fetchLoginStatus();
  }, []); 

  
  if (!isLoggedIn) {
    navRight = (
      <>
      <div className="navlink">
        <a className="navbar-button" id="login-button" onClick={handleLogin} > LOG IN </a>
        <a className="navbar-button" id="signup-button" onClick={handleSignUp} > SIGN UP </a>
      </div>
      </>
    );
  } else {
    navRight = (
      <>
      <div className="navlink">
        <Link className="navbar-button" id="notes-button" to="/notes">NOTES</Link>
        <Link className="navbar-button" id="chat-button" to="/chat">CHAT</Link>
        <Link className="navbar-button" id="logout-button" to="/">
          <p id="logout-button-text" onClick={handleLogout}> LOG OUT </p>
        </Link>
      </div>
        
      </>
    );
  }

  function toggleLinks() {
    setIsLinkShown(prevState => !prevState);
    if(isLinkShown && window.innerWidth < 1020){
      document.getElementById("nav-right")!.style.display = "none";
    } else {
      document.getElementById("nav-right")!.style.display = "block";
    }
  }

  return (
    <div className="navigation-menu">
      <Link id="logo" to="/">
        Linguabot
      </Link>
      <div id="navbar-hamburger" onClick={toggleLinks}><FontAwesomeIcon id="hamburger-icon" icon={isLinkShown ? faX : faBars} /></div>
      <div id="nav-right">{navRight}</div>
    </div>
  );
}