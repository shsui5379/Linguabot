import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";  

// Navigation bar component
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
        <a className="navlink" id="navlink-rightmost" 
          href="https://dev-3pimm2jcsp5tvdbf.us.auth0.com/authorize?response_type=code&client_id=0XZ78NoX2OqMXCuDRDrCNaFbjoO4PGlF&redirect_uri=http://localhost:8080/callback&prompt=login&screen_hint=signup" >
          <p className="nav-button-filled"> SIGN UP </p>           
        </a>
        <a className="navlink" onClick={handleLogin} >
          <p className="nav-button-white"> LOG IN </p>
        </a>
      </>
    );
  } else {
    navRight = (
      <>
        <Link className="navlink" id="navlink-rightmost" to="/">
          <p className="nav-button-filled"> LOG OUT </p>
        </Link>
        <Link className="navlink" to="/chat">
          <p className="nav-button-white"> CHAT </p>
        </Link>
      </>
    );
  }

  return (
    <div className="navigation-menu">
      <Link id="logo" to="/">
        Linguabot
      </Link>
      {navRight}
    </div>
  );
}
