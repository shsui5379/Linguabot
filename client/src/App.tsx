import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.tsx";
import Home from "./pages/Home.tsx";
import LogIn from "./pages/LogIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import UserHome from "./pages/UserHome.tsx";
import NavigationBar from "./components/NavigationBar";
import "./App.css";

function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar isLoggedIn={loginStatus} onLogin={setLoginStatus} />
        <Routes>
          <Route path="/" element={<Home />} />;
          <Route path="/login" element={<LogIn />} />;
          <Route path="/signup" element={<SignUp />} />;
          <Route path="/home" element={<UserHome />} />;
          <Route path="/chat" element={<ChatRoom />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
