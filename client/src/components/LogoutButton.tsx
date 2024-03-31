import { useAuth0 } from "@auth0/auth0-react";
import "../css/ButtonComponent.css";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button id="logout-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      LOG OUT
    </button>
  );
};

export default LogoutButton; 
