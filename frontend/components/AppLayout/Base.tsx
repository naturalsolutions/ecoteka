import { FC, createContext, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import AppLayoutHeader from "@/components/AppLayout/Header";
import Dialog, { ETKDialogActions } from "@/components/Dialog";
import Snackbars from "@/components/Snackbars";
import { NoSsr } from "@material-ui/core";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import { useAppContext } from "@/providers/AppContext";
import CookieConsent from "react-cookie-consent";

const AppLayout = createContext(null);

export const useAppLayout = () => useContext(AppLayout);

const AppLayoutBase: FC = ({ children }) => {
  const { t } = useTranslation(["common", "components"]);
  const snackbar = useRef();
  const dialog = useRef<ETKDialogActions>(null);
  const { organization, user } = useAppContext();
  const ability = buildAbilityFor(
    user?.is_superuser
      ? "admin"
      : organization?.current_user_role
      ? organization?.current_user_role
      : "guest"
  );

  return (
    <AbilityContext.Provider value={ability}>
      <AppLayout.Provider value={{ dialog, snackbar, t }}>
        <NoSsr>
          <AppLayoutHeader />
          {children}
          <Dialog ref={dialog} />
          <Snackbars ref={snackbar} />
          <CookieConsent
            enableDeclineButton
            location="bottom"
            buttonText={t("components.CookieConsent.buttonText")}
            declineButtonText={t("components.CookieConsent.declineButtonText")}
            cookieName="etk-cookie-consent"
            style={{ background: "#384145" }}
            buttonStyle={{
              color: "#fff",
              background: "#000",
              fontSize: "13px",
            }}
            declinebuttonStyle={{
              color: "#000",
              background: "#fff",
              fontSize: "13px",
            }}
            expires={150}
          >
            {t("components.CookieConsent.modalText")}
          </CookieConsent>
        </NoSsr>
      </AppLayout.Provider>
    </AbilityContext.Provider>
  );
};

export default AppLayoutBase;
