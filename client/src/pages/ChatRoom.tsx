// ChatRoom component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse, faRightFromBracket, faNoteSticky, faMicrophone, faX, faGear } from "@fortawesome/free-solid-svg-icons";
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
  const speechRecognition = useRef(null);
  const navigateTo = useNavigate();

  // Fetch user and conversation data on mount, and also initialize speech recognition
  useEffect(() => {
    User.fetchUser()
      .then((user) => {
        setSelectedLanguage(user.targetLanguages[0]);
        Conversation.fetchConversations()
          .then((conversations) => setConversations(
            conversations.filter((conversation) => conversation.language === user.targetLanguages[0])
          ));

        const locales = {
          Spanish: "es-ES",
          Korean: "ko-KR",
          Japanese: "ja-JA",
          English: "en-US",
          Mandarin: "zh-CN",
          French: "fr-FR"
        };
        speechRecognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        if (speechRecognition.current !== null) {
          speechRecognition.current.lang = locales[user.targetLanguages[0] as keyof typeof locales];
          speechRecognition.current.interimResults = true;
          speechRecognition.current.maxAlternatives = 1;
          speechRecognition.current.onresult = (event) => {
            let message = Array.from(event.results).map((result) => result[0].transcript).join("");
            setInputMessage(message);
          };
          speechRecognition.current.onspeechend = () => {
            speechRecognition.current.stop();
            setMicActive(false);
          };
          speechRecognition.current.onerror = (event) => {
            setMicActive(false);
          };
        }
      })
      .catch((error) => {
        if (error.message === "User doesn't exist") {
          navigateTo("/register");
        }
      });
  }, []);
  
  // Performing speech-to-text
  function handleDictation() {
    if (speechRecognition.current === null) {
      alert("Sorry, your browser doesn't support speech recognition");
      return;
    }

    if (micActive) {
      setMicActive(false);
      speechRecognition.current.stop();
      return;
    }

    setMicActive(true);
    speechRecognition.current.start();
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

  function openSettings() {
    document.getElementById("chatroom")!.style.visibility = "hidden";
    document.getElementById("settings")!.style.visibility = "visible";
  }

  function closeSettings() {
    document.getElementById("chatroom")!.style.visibility = "visible";
    document.getElementById("settings")!.style.visibility = "hidden";
  }
  
  // Generate the conversation list
  function getConversationList() {
    return conversations.map((conversation, index) =>
      <div className="chat">
        <button className="chat-overview" 
                onClick={() => setSelectedConversation(index)}
                id={`${index === selectedConversation ? "active-chat" : ""}`}>
          <p className="chat-nickname">{conversation.nickname}</p>
          <button id="chat-delete"
                  onClick={async (e) => 
                    {
                      e.stopPropagation();
                      if(window.confirm("Do you want to delete chat " + conversation.nickname + "?")) {
                      try {
                        await conversation.delete();
                        if(selectedConversation > 0) {
                          setSelectedConversation(selectedConversation - 1);
                        }
                        conversations.splice(index, 1);
                        setConversations([...conversations]);
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}>
                  <FontAwesomeIcon icon={faX} />
          </button>
        </button>
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
      return <Message key={message.messageId} message={message} selectedLanguage={selectedLanguage} />;
    }).reverse();
    if (justSent) {
      messageHistory.unshift(
        <Message
          key={"impossible-id"}
          message={{role: "user", content: sentMessageBuffer.current, starred: false, timestamp: Date.now()}}
          selectedLanguage={selectedLanguage}
        />
      )
    }
    return messageHistory;
  }

  return (
  <>
  {/** Settings */}
    <div id="settings">
      <div id="settings-header">
        <h2>Settings</h2>
        <FontAwesomeIcon id="exit-settings" icon={faX} onClick={closeSettings}></FontAwesomeIcon>
      </div>
      <div className="setting-wrapper">
        <p>Toggle automatic text-to-speech: </p>
        <label className="switch">
          <input id="setting-tts" type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <span className="setting-description">If on, Linguabot will always read out loud its texts!</span>
      <div className="setting-wrapper">
        <p>Toggle automatic speech-to-text: </p>
        <label className="switch">
          <input id="setting-stt" type="checkbox" />
          <span className="slider round"></span>
        </label>
      </div>
      <span className="setting-description">If on, your mic will always pick up what you say when it's your turn to send a message!</span>
    </div>

  {/** Side panel for saved chats and creating a new chat */}
  <div id="chatroom">
    <div id="sidebar">
      <button id="sidebar-addchat" onClick={handleCreateNewChat}><FontAwesomeIcon icon={faPlus} id="sidebar-plus"/> Create New Chat</button>
      <div id="sidebar-chat-list">
        {getConversationList()}
      </div>
      <div id="sidebar-nav">
        <Link className="sidebar-nav-link" to="/"> 
          <FontAwesomeIcon icon={faHouse} /> 
          <span className="tooltiptext" id="toolkit-home">Return Home</span>
        </Link>
        <Link className="sidebar-nav-link" to="/Notes"> 
          <FontAwesomeIcon icon={faNoteSticky} /> 
          <span className="tooltiptext" id="toolkit-notes">Saved Messages</span>
        </Link>
        <div className="sidebar-nav-link" onClick={openSettings}> 
          <FontAwesomeIcon icon={faGear} /> 
          <span className="tooltiptext" id="toolkit-settings">Settings</span>
        </div>
        <div className="sidebar-nav-link" onClick={handleLogout}> 
          <FontAwesomeIcon icon={faRightFromBracket} /> 
          <span className="tooltiptext" id="toolkit-logout">Log Out</span>
        </div>
      </div>
    </div>

    <div id="chat-box">
      {/** Text messages */}
      <div id="chat-messages">
        {getMessageHistory()}
      </div>

      {/** Input and send message box */}
      <div id="chat-text-wrapper">
        <form id="chat-text" onSubmit={(event) => handleFormSubmit(event)}>
          <textarea
                id="user-text-type"
                name="user-text-type"
                required-minlength="1"
                placeholder={micActive ? "Say something..." : "Type something..."}
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}>
          </textarea>
          <button type="button" title="Speech to text" id="speech-to-text"><FontAwesomeIcon icon={faMicrophone} id={micActive ? "speech-to-text-icon-active" : "speech-to-text-icon"} onClick={handleDictation}/></button>
          <button title="Send text" id="user-text-send"><img id="user-text-send-icon" src="https://img.icons8.com/ios-glyphs/90/paper-plane.png" alt="paper-plane"/></button>
        </form>
      </div>
    </div>
  </div>
  </>
  );
}