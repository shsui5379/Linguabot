// ChatRoom component
import "../css/ChatRoom.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse, faRightFromBracket, faNoteSticky, faMicrophone, faX, faGear } from "@fortawesome/free-solid-svg-icons";
import Message from "../components/Message";
import { useState, useRef } from "react";
import Conversation from "../types/Conversation";
import messagetools from "../utilities/messagetools";
import { Language } from "../types/Language";
import useDictation from "../hooks/useDictation";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchConversationData from "../hooks/useFetchConversationData";
import useRegistrationCheck from "../hooks/useRegistrationCheck";

export default function ChatRoom() {
  const [autotts, setAutotts] = useState(false);
  const [autostt, setAutostt] = useState(false);
  useRegistrationCheck();
  const [user, setUser] = useFetchUserData();
  const [conversations, setConversations] = useFetchConversationData((user === null) ? "" : user.targetLanguages[0], false);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [dictationActive, toggleDictation] = useDictation((user === null) ? "" : user.targetLanguages[0], setInputMessage);
  const [justSent, setJustSent] = useState(false);
  const sentMessageBuffer = useRef("");
  const [loading, setLoading] = useState(false);

  // Performing text-to-speech
  function speak(message: string) {
    return messagetools.speak(message, user.targetLanguages[0] as Language);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    if (inputMessage.trim().length > 0) {
      sentMessageBuffer.current = inputMessage;
      setInputMessage("");
      setJustSent(true);
      await conversations[selectedConversation].send(sentMessageBuffer.current);
      setJustSent(false);
      setConversations([...conversations]);
      await conversations[selectedConversation].receive();
      setConversations([...conversations]);
      let speaker;
      if (autotts) {
        let readMsg = conversations[selectedConversation].messages.slice(-1)[0]['content'];
        speaker = speak(readMsg);
      }
      if (autostt) {
        if (autotts) { // wait until linguabot finishes speaking
          speaker!.onend = toggleDictation;
        } else {
          toggleDictation();
        }
      }
    }
  }

  async function handleCreateNewChat() {
    let conversation;
    try {
      conversation = await Conversation.createConversation(user.targetLanguages[0], "new conversation");
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

    if (autostt) {
      toggleDictation();
    }
  }

  // Generate the conversation list
  function getConversationList() {
    return conversations.map((conversation, index) =>
      <div className="chat">
        <button className="chat-overview"
          onClick={() => setSelectedConversation(index)}
          id={`${index === selectedConversation ? "active-chat" : ""}`}>
          <p className="chat-nickname">{conversation.nickname}</p>
          <button className="chat-delete" title="Delete chat"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm("Do you want to delete chat " + conversation.nickname + "?")) {
                try {
                  await conversation.delete();
                  if (selectedConversation > 0) {
                    setSelectedConversation(selectedConversation - 1);
                  }
                  conversations.splice(index, 1);
                  setConversations([...conversations]);
                } catch (error) {
                  console.error(error);

                  if (error.message === "Must have at least one chat open") {
                    alert("Must have at least one chat open");
                  }
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

    let lastIndex = conversations[selectedConversation].messages.length - 1;

    let messageHistory = conversations[selectedConversation].messages.map((message, index) => {
      if (index === 0) {
        return <></>;
      }

      if (index === lastIndex) {
        return <Message key={message.messageId} message={message} selectedLanguage={user.targetLanguages[0]} userLanguage={user.userLanguage} mostRecent={true} />;
      }

      return <Message key={message.messageId} message={message} selectedLanguage={user.targetLanguages[0]} userLanguage={user.userLanguage} mostRecent={false} />;
    }).reverse();
    if (justSent) {
      messageHistory.unshift(
        <Message
          key={"impossible-id"}
          message={{ role: "user", content: sentMessageBuffer.current, starred: false, timestamp: Date.now() }}
          selectedLanguage={user.targetLanguages[0]}
          mostRecent={true}
        />
      )
    }
    return messageHistory;
  }

  async function handleNewLang(e) {
    let selectedLanguage = e.target.value;
    let targetLanguages = user.targetLanguages;
    let index = targetLanguages.indexOf(selectedLanguage);
    if (index === -1) {
      targetLanguages.unshift(selectedLanguage);
    }
    else {
      [targetLanguages[0], targetLanguages[index]] = [targetLanguages[index], targetLanguages[0]];
    }
    setUser(await user.setTargetLanguages(targetLanguages));
  }

  function getNewLanguage() {
    const languages_supported = ["English", "Spanish", "French", "Mandarin", "Japanese", "Korean"];
    return (
      <select id="chat-lang-select" value={(user === null) ? "" : user.targetLanguages[0]} onChange={handleNewLang}>
        {languages_supported.map((lang, index) =>
          <option value={lang}>{lang}</option>)
        }
      </select>
    )
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
            <span className="slider round" onClick={() => { setAutotts(prevState => !prevState) }}></span>
          </label>
        </div>
        <span className="setting-description">If on, Linguabot will always read out loud its texts!</span>
        <div className="setting-wrapper">
          <p>Toggle automatic speech-to-text: </p>
          <label className="switch">
            <input id="setting-stt" type="checkbox" />
            <span className="slider round" onClick={() => { setAutostt(prevState => !prevState) }}></span>
          </label>
        </div>
        <span className="setting-description">If on, your mic will always pick up what you say when it's your turn to send a message!</span>
      </div>

      {/** Side panel for saved chats and creating a new chat */}
      <div id="chatroom">
        <div id="sidebar">
          {getNewLanguage()}
          <button id="sidebar-addchat" onClick={handleCreateNewChat}><FontAwesomeIcon icon={faPlus} id="sidebar-plus" /> Create New Chat</button>
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
                disabled={conversations.length === 0}
                minLength={1}
                maxLength={1024}
                id="user-text-type"
                name="user-text-type"
                required-minlength="1"
                placeholder={conversations.length === 0 ? "Create a chat to get started" : (dictationActive ? "Say something..." : "Type something...")}
                value={inputMessage}
                onKeyDown={(e) => {
                  if (e.key === "NumpadEnter" || e.key === "Enter") {
                    handleFormSubmit(e);
                  }
                }}
                onChange={(event) => setInputMessage(event.target.value)}>
              </textarea>
              <button disabled={conversations.length === 0} type="button" title="Speech to Text" id="speech-to-text"><FontAwesomeIcon icon={faMicrophone} id={dictationActive ? "speech-to-text-icon-active" : "speech-to-text-icon"} onClick={toggleDictation} /></button>
              <button disabled={conversations.length === 0} title="Send Text" id="user-text-send"><img id="user-text-send-icon" src="https://img.icons8.com/ios-glyphs/90/paper-plane.png" alt="paper-plane" /></button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}