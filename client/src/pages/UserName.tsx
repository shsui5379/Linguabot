// Name component: asks user for their name
import "../css/UserName.css"
import NavigationBar from "../components/NavigationBar";
export default function UserName() {
  return(
    <>
    <NavigationBar/>
    <div id="name-page">
      <p>Please enter your name</p>

      <form id="name-form">
        <input type="text"
              id="first-name"
              name="first-name"
              required-minlength="1"
              placeholder="First name"
              value="">
        </input>
        <input type="text"
              id="last-name"
              name="last-name"
              required-minlength="1"
              placeholder="Last name"
              value="">
        </input>
        <button id="name-form-continue">Continue</button>
      </form>
    </div>
    </>
  );
}
