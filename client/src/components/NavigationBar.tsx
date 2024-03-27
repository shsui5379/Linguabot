import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";  

// Navigation bar component
// the isLoggedIn property is supposed to temporary simulate authentication. Remove it later
export default function NavigationBar() {
  // Determine the correct things to display on the right side of the navigation bar
  let navRight = null; 

  // Redirect users to the Auth0 login page
  const handleLogin = () => {
    window.location.href = '/login';
  }; 
 
  // Set login status to false initally 
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Set logged in status after callback from login
  useEffect(() => { 
    async function fetchLoginStatus() {
      try {
        const response = await fetch('/status');
        const data =  await response.text(); 
        if (data == 'Logged in') {
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
        <a className="navlink" id="navlink-rightmost" 
          href="https://dev-3pimm2jcsp5tvdbf.us.auth0.com/authorize?response_type=code&client_id=0XZ78NoX2OqMXCuDRDrCNaFbjoO4PGlF&redirect_uri=http://localhost:8080/callback&prompt=login&screen_hint=signup" >
          <p className="center-text" id="signup"> SIGN UP </p>           
        </a>
        <a className="navlink" onClick={handleLogin} >
          <p className="center-text" id="login"> LOG IN </p>
        </a>
      </>
    );
  } else {
    navRight = (
      <>
        <Link className="navlink" to="/chat">
          <p className="center-text" id="chatroom"> CHAT ROOM </p>
        </Link>
        <Link
          className="navlink"
          to="/"
          // onClick={() => onLogin(false)}
        >
          <p className="center-text" id="signout"> SIGN OUT </p>
        </Link>
      </>
    );
  }

  return (
    <div className="navigation-menu">
      <Link 
        id="logo"
        to="/"
      >
        Linguabot
      </Link>
      {navRight}
    </div>
  );
}
