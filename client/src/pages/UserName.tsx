// Name component: asks user for their name
import "../css/UserName.css"
<<<<<<< HEAD
export default function UserName({firstName, lastName, setFirstName, setLastName, setFlowState}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
=======
import { Link } from "react-router-dom";
import { useState } from "react";
export default function UserName() {  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
>>>>>>> 68a8c83701907f80463c844b77739c3785103096
    e.preventDefault();
    setFlowState();
  };

  return(
    <>
      <div id="name-page">
        <p id="name-instruction">Enter your name</p>
        <form id="name-form" onSubmit={handleSubmit}>
          {/** First name */}
          <input type="text"
            id="first-name"
            name="first-name"
            required-minlength="1"
            placeholder="First name"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}>
          </input>

          {/** Last name */}
          <input type="text"
            id="last-name"
            name="last-name"
            required-minlength="1"
            placeholder="Last name"
            onChange={(event) => setLastName(event.target.value)}
            value={lastName}>
          </input>
          <button id="name-form-continue">CONTINUE</button>
        </form>
      </div>
    </>
  );
}
