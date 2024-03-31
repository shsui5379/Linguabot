import { useState, useEffect  } from 'react';
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";   
import LoginButton from './LoginButton'; 
import SignUpButton from './SignUpButton'; 
import LogoutButton from './LogoutButton'; 
import { useAuth0 } from "@auth0/auth0-react";

// Navigation bar component
export default function NavigationBar() {
  // Determine the correct things to display on the right side of the navigation bar
  const { user, isAuthenticated, isLoading } = useAuth0();
  let navRight = null; 
  
  if (!isAuthenticated) {
    navRight = (
      <>
        <div className="navlink">
          <LoginButton/>
          <SignUpButton/>
        </div>
      </>
    );
  } else {
    navRight = (
      <>
        <div className="navlink">
          <Link id="chat-button" to="/chat">CHAT</Link>
          <LogoutButton/>
        </div>
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
