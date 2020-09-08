import { Button } from "@material-ui/core";
import { useAppContext } from "../providers/AppContext.js";
import { apiRest } from "../lib/api";

export interface ETKLogoutProps {
  logoutText: string;
}

const ETKLogout: React.FC<ETKLogoutProps> = (props) => {
  const { appContext, setAppContext } = useAppContext();

  return (
    <Button
      onClick={(e) => {
        apiRest.auth.logout();
        setAppContext({
          ...appContext,
          user: null,
        });
      }}
    >
      {props.logoutText}
    </Button>
  );
};

export default ETKLogout;
