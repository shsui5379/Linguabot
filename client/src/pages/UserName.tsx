// Name component: asks user for their name
import "../css/UserName.css"
export default function UserName({ firstName, lastName, setFirstName, setLastName, setFlowState }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFlowState();
  };

  return (
    <>
      <div id="name-page">
        <p id="name-instruction">Enter your name</p>
        <form id="name-form" onSubmit={handleSubmit}>
          <input type="text"
            required
            id="first-name"
            name="first-name"
            required-minlength="1"
            maxLength={255}
            placeholder="First name"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}>
          </input>
          <input type="text"
            required
            id="last-name"
            name="last-name"
            required-minlength="1"
            maxLength={255}
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
