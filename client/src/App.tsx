import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.tsx";
import Home from "./pages/Home.tsx";
import UserName from "./pages/UserName.tsx";
import SignUp from "./pages/SignUp.tsx";
import UserHome from "./pages/UserHome.tsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />;
          <Route path="/name" element={<UserName/>} />;
          <Route path="/signup" element={<SignUp />} />;
          <Route path="/home" element={<UserHome />} />;
          <Route path="/chat" element={<ChatRoom />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
