import React, { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";   
import LoginButton from './LoginButton'; 
import SignUpButton from './SignUpButton'

// Navigation bar component
export default function NavigationBar() {
  // Determine the correct things to display on the right side of the navigation bar
  let navRight = null; 

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
          <SignUpButton/>
          <LoginButton/>
      </>
    );
  } else {
    navRight = (
      <>
        <Link className="navlink" id="navlink-rightmost"  to="/">
          <p className="nav-button-filled" onClick={handleLogout}> LOG OUT </p>
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
