import { useAuth0 } from "@auth0/auth0-react";
import "../css/ButtonComponent.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button id="signup-button" onClick={() => loginWithRedirect({
    authorizationParams: {
        screen_hint: 'signup'
    }
  })}> SIGN UP</button>;
};

export default LoginButton;