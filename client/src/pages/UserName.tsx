// Name component: asks user for their name
import "../css/UserName.css"
import NavigationBar from "../components/NavigationBar"; 
import { useState } from "react"
export default function UserName() {  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = { 
      firstName : firstName, 
      lastName : lastName
    }; 

    try {
      const response = await fetch('/names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      // Handle success, update state, show notifications, etc.
      console.log('Success:', data);
      
    } catch (error) {
      // Handle errors, show error messages, etc. 
      console.error('Error:', error);  
    }
  };

  return(
    <>
    <NavigationBar/>
    <div id="name-page">
      <p>Please enter your name</p>

      <form id="name-form" onSubmit={handleSubmit}>
        <input type="text"
              id="first-name"
              name="first-name"
              required-minlength="1"
              placeholder="First name" 
              onChange={(event) => setFirstName(event.target.value)}
              value={firstName}>
        </input>
        <input type="text"
              id="last-name"
              name="last-name"
              required-minlength="1"
              placeholder="Last name" 
              onChange={(event) => setLastName(event.target.value)}
              value={lastName}>
        </input>
        <button id="name-form-continue">Continue</button>
      </form>
    </div>
    </>
  );
}
