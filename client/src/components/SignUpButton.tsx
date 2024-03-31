import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect({
    authorizationParams: {
        screen_hint: 'signup'
    }
  })}> Sign Up</button>;
};

export default LoginButton;