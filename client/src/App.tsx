import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/ChatRoom.tsx";
import Home from "./pages/Home.tsx";
import UserHome from "./pages/UserHome.tsx";
import SignUpFlow from "./pages/SignUpFlow.tsx";
import Notes from "./pages/Notes.tsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />;
          <Route path="/register" element={<SignUpFlow />} />;
          <Route path="/home" element={<UserHome />} />;
          <Route path="/chat" element={<ChatRoom />} />;
          <Route path="/notes" element={<Notes />} />;
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
