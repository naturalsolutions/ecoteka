import { Button } from "@material-ui/core";
import { useAppContext } from "../providers/AppContext.js";
import { apiRest } from "../lib/api";
import i18n from "../i18n";

export interface ETKLogoutProps {
  logoutText: string;
  onClick?: () => void;
}

const defaultProps: ETKLogoutProps = {
  logoutText: "Déconnexion",
};

const ETKLogout: React.FC<ETKLogoutProps> = (props) => {
  const { t } = i18n.useTranslation("common");
  const { setUser } = useAppContext();

  return (
    <Button
      onClick={(e) => {
        if (props.onClick) {
          props.onClick();
        }

        apiRest.auth.logout();
        setUser(null);
      }}
    >
      {t("logout")}
    </Button>
  );
};

ETKLogout.defaultProps = defaultProps;

export default ETKLogout;
