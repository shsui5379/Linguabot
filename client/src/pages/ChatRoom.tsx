// Chat room component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ChatSession } from "../classes/ChatSession";

export default function ChatRoom() {
  // States for keeping track of message history and current input message
  const [messages, setMessages] = useState(new ChatSession([], "You are a conversational language partner. Only respond back to the user in French. Do not ever respond back in another language even if the user switches language."));
  const [inputMessage, setInputMessage] = useState('');

  // Saved chats
  // var chats_list = ["comment ca va?", "mes amis sont tres popula..."];
  // var saved_chats = [chats_list.map(item =>
  //   <div className="chat">
  //     <button className="chat-overview">{item}</button>
  //   </div>
  // )];

  // Conditionally determine this in the future based on stored user preferences
  function getMessages() {
    return messages.messageHistory.map((message, index) => {
      // Skip the configuration message
      if (index === 0)
        return <></>;
      return (
        <div className="text">
          <p className={message.role === "user" ? "user-text" : "bot-text"}>{message.content?.toString()}</p>
        </div>
      );
    }).reverse();
  }

  /**
   * @returns A promise pending on a user's target languages
   */
  async function fetchTargetLanguages() {
    let response = await fetch("/api/user", {
      method: "GET"
    });
    let user = await response.json();
    return user.targetLanguages;
  }

  // Temporary initial messages in supported languages. 
  let initial_message_map = new Map();
  initial_message_map.set("English", "Hello! I'm Linguabot, your personal conversational partner. What would you like to talk about today?");
  initial_message_map.set("Spanish", "¡Hola! Soy Linguabot, tu compañero de conversación personal. ¿De qué te gustaría hablar hoy?");
  initial_message_map.set("French", "Bonjour! Je suis Linguabot, votre interlocuteur personnel. De quoi aimeriez-vous parler aujourd’hui?");
  initial_message_map.set("Mandarin", "你好！我是 Linguabot，你的私人对话伙伴。今天你想聊什么？");
  initial_message_map.set("Japanese", "こんにちは！ あなたの個人的な会話パートナー、Linguabot です。今日は何について話したいですか?");
  initial_message_map.set("Korean", "안녕하세요! 너의 개인 대화 파트너 Linguabot입니다. 오늘은 어떤 이야기를 하고 싶으신가요?");

  let initial_message = initial_message_map.get("");

  // Handles form submission
  async function handleFormSubmit(event) {
    event.preventDefault();
    let updated_messages = new ChatSession(messages.messageHistory);
    updated_messages.send(inputMessage);
    setInputMessage('');
    setMessages(updated_messages);
    updated_messages = new ChatSession(updated_messages.messageHistory);
    await updated_messages.receive();
    setMessages(updated_messages);
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
          {getMessages()}
          <div className="text">
            <p className="bot-text">{initial_message}</p>
          </div>
        </div>
      </div>

      {/** Input and send message box */}
      <div id="chat-text-wrapper">
        <form id="chat-text" onSubmit={(event) => handleFormSubmit(event)}>
          <input type="text"
                id="user-text-type"
                name="user-text-type"
                required-minlength="1"
                placeholder="Type something..."
                value={inputMessage}
                onChange={(event) => {setInputMessage(event.target.value)}}>
          </input>
          <button id="user-text-send"><FontAwesomeIcon icon={faPaperPlane}/></button>
        </form>
      </div>
    </div>
  </>
  );
}
