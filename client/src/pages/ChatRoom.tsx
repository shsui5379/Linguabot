// Chat room component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ChatSession } from "../classes/ChatSession";

export default function ChatRoom() {
  // States for keeping track of message history and current input message
  const [messages, setMessages] = useState(new ChatSession([], "You are a conversational partner for your supported language. Only respond back to the user in the selected language."));
  const [inputMessage, setInputMessage] = useState('');

  /** Saved chats */
  var chats_list = ["chat 1", "chat 2"];
  var saved_chats = [chats_list.map(item =>
    <div className="chat">
      <button className="chat-overview">{item}</button>
    </div>
  )];

  // Conditionally determine this in the future based on stored user preferences
  let initial_message = "Hello, I'm Linguabot, your personal conversational partner. What would you like to talk about today?"

  async function retrieveMessages() {
    let updated_history = new ChatSession();
    updated_history.messageHistory = messages.messageHistory;
    let response = await updated_history.send(inputMessage);
    setMessages(updated_history);
    setInputMessage('');
    return response;
  } 

  const handleLogout = () => { 
    window.location.href = '/logout'
  }
  
  return(
  <>
  {/** Side panel for saved chats and creating a new chat */}
    <div id="sidebar">
      <button id="sidebar-addchat"><FontAwesomeIcon icon={faPlus} id="sidebar-plus"/> Create New Chat</button>
      {saved_chats}
      
      <div id="sidebar-nav-wrapper">
        <div id="sidebar-nav">
          <Link className="sidebar-nav-link" to="/"> 
            <FontAwesomeIcon icon={faHouse} /> 
            <span className="tooltiptext">Return Home</span>
          </Link>
          <div className="sidebar-nav-link" onClick={handleLogout}> 
            <FontAwesomeIcon icon={faRightFromBracket} /> 
            <span className="tooltiptext">Log Out</span>
          </div>
        </div>
      </div>
    </div>

    <div id="chat-box">
      {/** Text messages */}
      <div id="chat-messages-wrapper">
        <div id="chat-messages">
          {messages.messageHistory.map((message, index) => {
            // Skip the configuration message
            if (index === 0)
              return <></>;
            return (
              <div className="text">
                <p className={message.role === "user" ? "user-text" : "bot-text"}>{message.content?.toString()}</p>
              </div>
            );
          }).reverse()}
          <div className="text">
            <p className="bot-text">{initial_message}</p>
          </div>
        </div>
      </div>

      {/** Input and send message box */}
      <div id="chat-text-wrapper">
        <form id="chat-text" onSubmit={(event) => event.preventDefault()}>
          <input type="text"
                id="user-text-type"
                name="user-text-type"
                required-minlength="1"
                placeholder="Type something..."
                value={inputMessage}
                onChange={(event) => {setInputMessage(event.target.value)}}>
          </input>
          <button id="user-text-send" onClick={async () => await retrieveMessages()}><FontAwesomeIcon icon={faPaperPlane}/></button>
        </form>
      </div>
    </div>
  </>
  );
}
