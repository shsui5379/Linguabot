// Chat room component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse, faRightFromBracket, faStar as faStarSolid, faVolumeHigh, faLanguage, faNoteSticky} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect, useRef } from "react";
import { ChatSession } from "../types/ChatSession";
import User from "../types/User";

export default function ChatRoom() {
  // States for keeping track of message history and current input message
  const [messages, setMessages] = useState(new ChatSession([], ""));
  const [inputMessage, setInputMessage] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const [starIcon, setStarIcon] = useState(faStarReg);
  const user_info: any = useRef();
  const initial_message = useRef("");
  const initial_message_map = useRef(new Map())

  // Saved chats
  var chats_list = ["Chat 1", "Chat 2"];
  var saved_chats = [chats_list.map(item =>
    <div className="chat">
      <button className="chat-overview">{item}</button>
    </div>
  )];

  var targetLanguage = "";

  // Do user fetching on mount
  useEffect(() => {
    initial_message_map.current.set("English", "Hello! I'm Linguabot, your personal conversational partner. What would you like to talk about today?");
    initial_message_map.current.set("Spanish", "¡Hola! Soy Linguabot, tu compañero de conversación personal. ¿De qué te gustaría hablar hoy?");
    initial_message_map.current.set("French", "Bonjour! Je suis Linguabot, votre interlocuteur personnel. De quoi aimeriez-vous parler aujourd’hui?");
    initial_message_map.current.set("Mandarin", "你好！我是 Linguabot，你的私人对话伙伴。今天你想聊什么？");
    initial_message_map.current.set("Japanese", "こんにちは！ あなたの個人的な会話パートナー、Linguabot です。今日は何について話したいですか?");
    initial_message_map.current.set("Korean", "안녕하세요! 너의 개인 대화 파트너 Linguabot입니다. 오늘은 어떤 이야기를 하고 싶으신가요?");
    User.fetchUser().then((user) => {
      user_info.current = user;
      targetLanguage = user_info.current.targetLanguages[0];
      console.log("42 targetlang " + targetLanguage);
      setMessages(new ChatSession([], `You are a conversational language partner. Only respond back to the user in ${targetLanguage}. Do not ever respond back in another language even if the user switches language.`));
      initial_message.current = initial_message_map.current.get(targetLanguage);
    });
  }, []);

  // Add message to favorites and change star icon
  function favMessage() {
    setSavedMessage(!savedMessage);
    setStarIcon(savedMessage ?  faStarReg : faStarSolid);
  }

  function getMessages() {
    return messages.messageHistory.map((message, index) => {
      let message_string = message.content?.toString() as string;
      // Skip the configuration message
      if (index === 0)
        return <></>;
      return (
      <>
        <div className={message.role === "user" ? "user-text-wrapper" : "bot-text-wrapper"}>
          <p className={message.role === "user" ? "user-text" : "bot-text"}>{message_string}</p>
          <div className={message.role === "user" ? "message-tools-user-wrapper" : "message-tools-bot-wrapper"}>
            <div id="message-tools-bot">
              <button className="message-tools-button" id="message-fav" onClick={favMessage}>{<FontAwesomeIcon icon={starIcon}/>}</button>
              <button className="message-tools-button" id="message-listen" onClick={()=> textToSpeech(message_string)}>{<FontAwesomeIcon icon={faVolumeHigh} />}</button>
              <button className="message-tools-button" id="message-translate">{<FontAwesomeIcon icon={faLanguage} />}</button>
            </div>
          </div>
        </div>
      </>
      );
    }).reverse();
  }

  // Text to Speech 
  async function textToSpeech(message_to_speak: string) {  
    const locales = {Spanish: "es-ES", Korean: "ko-KR", Japanese: "ja-JA", English: "en-US", Chinese: "zn-CN", French: "fr-FR"};
    // const access_locales = (lang: keyof typeof locales) => {
    //   return locales[lang];
    // };
    console.log("targetlang " + targetLanguage + '\n');
    console.log("LOCAL LANGES " + locales[targetLanguage as keyof typeof locales]);
    let targetVoice;
    for (let voice of speechSynthesis.getVoices()) {
      // if (voice.lang === access_locales[targetLanguage] ) {
      //     targetVoice= voice;
      //     break;
      // }
    }

    if ('speechSynthesis' in window && targetVoice) {
      // Speech Synthesis supported 🎉
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
    var msg = new SpeechSynthesisUtterance(); 
    console.log(message_to_speak);
    // msg.voice = targetVoice;
    msg.text = message_to_speak;
    window.speechSynthesis.speak(msg);
  }

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
          {getMessages()}
          <div className="text">
            <p className="bot-text">{initial_message.current}</p>
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
          <button id="user-text-send"><img id="user-text-send-icon" src="https://img.icons8.com/ios-glyphs/90/paper-plane.png" alt="paper-plane"/></button>
        </form>
      </div>
    </div>
  </>
  );
}
