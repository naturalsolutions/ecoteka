import { Button } from "@material-ui/core";
import { useAppContext } from "../providers/AppContext.js";
import { apiRest } from "../lib/api";
import { useTranslation } from "react-i18next";

export interface ETKLogoutProps {
  onClick?: () => void;
}

const ETKLogout: React.FC<ETKLogoutProps> = (props) => {
  const { t } = useTranslation("components");
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
      {t("Logout.logout")}
    </Button>
  );
};

export default ETKLogout;
