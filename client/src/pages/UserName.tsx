// Name component: asks user for their name
import "../css/UserName.css"
import NavigationBar from "../components/NavigationBar";
import { useState } from "react"
export default function UserName() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      firstName: firstName,
      lastName: lastName
    };

    try {
      localStorage.setItem('myData', JSON.stringify(userData));

      var retrievedData = localStorage.getItem('myData');
      if (retrievedData) {
        retrievedData = JSON.parse(retrievedData);
        console.log(retrievedData);
      } else {
        console.log('No data found');
      }
    } catch (error) {
      // Handle errors, show error messages, etc. 
      console.error('Error:', error);
    }
  };
  return (
    <>
      <NavigationBar />
      <div id="name-page">
        <p id="name-instruction">Enter your name</p>

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
          <Link id="name-form-continue" to="/language">CONTINUE</Link>
        </form>
      </div>
    </>
  );
}
