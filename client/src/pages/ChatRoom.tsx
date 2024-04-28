// ChatRoom component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse, faRightFromBracket, faNoteSticky, faMicrophone} from "@fortawesome/free-solid-svg-icons";
import Message from "../components/Message";
import { useState, useEffect, useRef } from "react";
import Conversation from "../types/Conversation";
import User from "../types/User";
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [justSent, setJustSent] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentMessageBuffer = useRef("");
  const navigateTo = useNavigate();

  // Fetch user and conversation data on mount
  useEffect(() => {
    User.fetchUser()
      .then((user) => {
        setSelectedLanguage(user.targetLanguages[0]);
        Conversation.fetchConversations()
          .then((conversations) => setConversations(conversations.filter((conversation) => conversation.language === user.targetLanguages[0])));
      })
      .catch((error) => {
        if (error.message === "User doesn't exist") {
          navigateTo("/register");
        }
      });
  }, []);
  
  // Performing speech-to-text
  function listen() {
    setMicActive(true);
    const locales = {
      Spanish: "es-ES",
      Korean: "ko-KR",
      Japanese: "ja-JA",
      English: "en-US",
      Chinese: "zn-CN",
      French: "fr-FR"
    };
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = locales[selectedLanguage as keyof typeof locales];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setMicActive(false);
    };
    
    recognition.onspeechend = () => {
      recognition.stop();
      setMicActive(false);
    };
    
    recognition.onerror = (event) => {
      alert("Error occurred while transcribing: " + event.error);
      setMicActive(false);
    };
  }
  
  async function handleFormSubmit(event) {
    event.preventDefault();
    if(inputMessage.trim().length > 0) {
      sentMessageBuffer.current = inputMessage;
      setInputMessage("");
      setJustSent(true);
      await conversations[selectedConversation].send(sentMessageBuffer.current);
      setJustSent(false);
      setConversations([...conversations]);
      await conversations[selectedConversation].receive();
      setConversations([...conversations]);
    }
  }

  async function handleCreateNewChat() {
    let conversation;
    try {
      conversation = await Conversation.createConversation(selectedLanguage, "new conversation");
    }
    catch (error) {
      console.error(error.message);
    }
    setConversations([...conversations, conversation]);
  }
  
  function handleLogout() {
    window.location.href = "/logout";
  }
  
  // Generate the conversation list
  function getConversationList() {
    return conversations.map((conversation, index) =>
      <div className="chat">
        <button className="chat-overview" onClick={() => setSelectedConversation(index)}>{conversation.nickname}</button>
      </div>
    );
  }

  // Generate the message history
  function getMessageHistory() {
    if (conversations.length === 0) {
      return [];
    }

    let messageHistory = conversations[selectedConversation].messages.map((message, index) => {
      if (index === 0) {
        return <></>;
      }
      return <Message message={message} selectedLanguage={selectedLanguage} />;
    }).reverse();
    if (justSent) {
      messageHistory.unshift(
        <Message 
          message={{role: "user", content: sentMessageBuffer.current, starred: false, timestamp: Date.now()}}
          selectedLanguage={selectedLanguage}
        />
      )
    }
    return messageHistory;
  }

  return (
  <>
  {/** Side panel for saved chats and creating a new chat */}
    <div id="sidebar">
      <button id="sidebar-addchat" onClick={handleCreateNewChat}><FontAwesomeIcon icon={faPlus} id="sidebar-plus"/> Create New Chat</button>
      {getConversationList()}
      <div id="sidebar-nav-wrapper">
        <div id="sidebar-nav">
          <Link className="sidebar-nav-link" to="/"> 
            <FontAwesomeIcon icon={faHouse} /> 
            <span className="tooltiptext" id="toolkit-home">Return Home</span>
          </Link>
          <Link className="sidebar-nav-link" to="/Notes"> 
            <FontAwesomeIcon icon={faNoteSticky} /> 
            <span className="tooltiptext" id="toolkit-notes">Saved Messages</span>
          </Link>
          <div className="sidebar-nav-link" onClick={handleLogout}> 
            <FontAwesomeIcon icon={faRightFromBracket} /> 
            <span className="tooltiptext" id="toolkit-logout">Log Out</span>
          </div>
        </div>
      </div>
    </div>

    <div id="chat-box">
      {/** Text messages */}
      <div id="chat-messages-wrapper">
        <div id="chat-messages">
          {getMessageHistory()}
        </div>
      </div>

      {/** Input and send message box */}
      <div id="chat-text-wrapper">
        <form id="chat-text" onSubmit={(event) => handleFormSubmit(event)}>
          <input type="text"
                id="user-text-type"
                name="user-text-type"
                required-minlength="1"
                placeholder={micActive ? "Say something..." : "Type something..."}
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}>
          </input>
          <button type="button" id="speech-to-text"><FontAwesomeIcon icon={faMicrophone} id={micActive ? "speech-to-text-icon-active" : "speech-to-text-icon"} onClick={listen}/></button>
          <button id="user-text-send"><img id="user-text-send-icon" src="https://img.icons8.com/ios-glyphs/90/paper-plane.png" alt="paper-plane"/></button>
        </form>
      </div>
    </div>
  </>
  );
}