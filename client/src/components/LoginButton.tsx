import { useAuth0 } from "@auth0/auth0-react";
import "../css/ButtonComponent.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button id="login-button" onClick={() => loginWithRedirect()}>LOG IN</button>;
};

export default LoginButton;