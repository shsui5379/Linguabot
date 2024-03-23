// Chat room component
import "../css/ChatRoom.css";

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
      <p id="side-conversations-title">Conversations</p>

      <div id="saved-conversations">{saved_conversations}</div>
      {/* <button id="side-conversations-add">Create New Chat</button> */}
    </div>
    <div id="chat">
      <div id="chat-text">
        <input type="text"
              id="user-text"
              name="user-text"
              required-minlength="1"
              placeholder="Type something...">
        </input>
        <img></img>
      </div>
    </div>
  </>
  );
}
