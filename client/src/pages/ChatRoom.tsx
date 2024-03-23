// Chat room component
import "../css/ChatRoom.css";

export default function ChatRoom() {
  return(
  <>
  <div id="chat-page">
    <div id="side-conversations">
      <div id="manage-bar">
        <p id="manage-bar-title">Conversations</p>
        <button id="manage-bar-add">+</button>
        <button id="manage-bar-hide">-</button>
      </div>

      <div id="saved-conversations">
        Chat 1
      </div>
    </div>
    <div id="chat">
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
