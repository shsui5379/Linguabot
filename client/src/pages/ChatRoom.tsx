// Chat room component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../css/ChatRoom.css";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function ChatRoom() {
  var conversations_list = ["chat 1", "chat 2"];
  var saved_conversations = [conversations_list.map(item =>
    <div className="conversation">
      <button className="conversation-overview">{item}</button>
    </div>
  )];
  
  return(
  <>
  {/** Side panel for saved conversations and creating a new chat */}
    <div id="side-conversations">
      <button id="side-conversations-add"><FontAwesomeIcon icon={faPlus} id="side-conversations-plus"/> Create New Chat</button>
      <div id="saved-conversations">{saved_conversations}</div>
    </div>

    <div id="chat">
      {/** Text messages */}
      <div id="chat-messages-wrapper">
        <div id="chat-messages">
          <div className="text">
            <p className="user-text">tell me hi in french</p>
          </div>
          <div className="text">
            <p className="bot-text">bonjourrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr</p>
          </div>
        </div>
      </div>

      {/** Input and send message box */}
      <div id="chat-text-wrapper">
        <form id="chat-text">
          <input type="text"
                id="user-text-type"
                name="user-text-type"
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
