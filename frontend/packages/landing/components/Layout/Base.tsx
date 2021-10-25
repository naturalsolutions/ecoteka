import { FC } from "react";
import LayoutHeader from "@/components/Layout/Header";
import LayoutFooter from "@/components/Layout/Footer";
import LayoutSubFooter from "@/components/Layout/SubFooter";
import { makeStyles } from "@material-ui/core";
import { EcotekaTheme } from "@/theme/config";
import CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme: EcotekaTheme) => ({
  main: {
    background: theme.palette.background.default,
  },

}));

const LayoutBase: FC = ({ children }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <LayoutHeader />
      <main className={classes.main}>{children}</main>
      <LayoutSubFooter />
      <LayoutFooter />
      <CookieConsent
            enableDeclineButton
            location="bottom"
            buttonText={t("CookieConsent.buttonText")}
            declineButtonText={t("CookieConsent.declineButtonText")}
            cookieName="etk-cookie-consent"
            style={{ background: "#384145" }}
            buttonStyle={{
              color: "#fff",
              background: "#000",
              fontSize: "13px",
            }}
            declineButtonStyle={{
              color: "#000",
              background: "#fff",
              fontSize: "13px",
            }}
            expires={150}
          >
            {t("CookieConsent.modalText")}
          </CookieConsent>

    </>
  );
};

export default LayoutBase;
