import { Button } from "@material-ui/core";
import { useAppContext } from "../providers/AppContext.js";
import { apiRest } from "../lib/api";

export interface ETKLogoutProps {
  logoutText: string;
}

const defaultProps: ETKLogoutProps = {
  logoutText: "Déconnexion",
};

const ETKLogout: React.FC<ETKLogoutProps> = (props) => {
  const { setUser } = useAppContext();

  return (
    <Button
      onClick={(e) => {
        apiRest.auth.logout();
        setUser(null);
      }}
    >
      {props.logoutText}
    </Button>
  );
};

ETKLogout.defaultProps = defaultProps;

export default ETKLogout;
