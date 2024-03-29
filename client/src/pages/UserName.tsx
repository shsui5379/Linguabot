// Name component: asks user for their name
import "../css/UserName.css"
import NavigationBar from "../components/NavigationBar";
import { Link } from "react-router-dom";
export default function UserName() {
  return(
    <>
    <NavigationBar/>
    <div id="name-page">
      <p id="name-instruction">Enter your name</p>

      <form id="name-form">
        <input type="text"
              id="first-name"
              name="first-name"
              required-minlength="1"
              placeholder="First name">
        </input>
        <input type="text"
              id="last-name"
              name="last-name"
              required-minlength="1"
              placeholder="Last name">
        </input>
        <Link id="name-form-continue" to="/language">CONTINUE</Link>
      </form>
    </div>
    </>
  );
}
