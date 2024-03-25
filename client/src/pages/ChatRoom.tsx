// Chat room component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/ChatRoom.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatRoom() {
  var conversations_list = ["chat 1", "chat 2"];
  var saved_conversations = [conversations_list.map(item =>
    <div className="conversation">
      <button className="conversation-overview">{item}</button>
    </div>
  )];
  
  return(
  <>
    <div id="side-conversations">
      <button id="side-conversations-add">Create New Chat</button>
      <div id="saved-conversations">{saved_conversations}</div>
    </div>
    <div id="chat">
      <div id="chat-messages">
        {/* <div className="bot-text">bonjour</div>
        <div className="user-text">hola</div> */}
      </div>
      <div id="chat-text-wrapper">
        <form id="chat-text">
          <input type="text"
                id="user-text-submit"
                name="user-text-submit"
                required-minlength="1"
                placeholder="Type something...">
          </input>
          <button id="user-text-send"><FontAwesomeIcon icon={faPaperPlane}/></button>
        </form>
      </div>
    </div>
  </>
  );
}
