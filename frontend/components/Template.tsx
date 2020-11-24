import React, { useEffect } from "react";
import { Hidden } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useAppContext } from "@/providers/AppContext";
import themeConfig from "@/theme/config";
import ETKDialog from "@/components/Dialog";
import ETKLayoutDesktop from "@/components/Layout/Desktop";
import ETKLayoutMobile from "@/components/Layout/Mobile";
import OrganizationList from "@/components/Organization/List";
import { useTranslation } from "react-i18next";

const TemplateContext = React.createContext(null);

export const useTemplate = () => React.useContext(TemplateContext);

export default function Template(props) {
  const dialogRef = React.useRef();
  const theme = createMuiTheme(themeConfig("dark"));
  const { isLoading, user, setUser } = useAppContext();
  const { t } = useTranslation(["components"]);

  const handlerOrganizationChange = (organization) => {
    const newUser = { ...user };
    newUser.currentOrganization = organization;
    setUser(newUser);

    dialogRef.current.close();
  };

  useEffect(() => {
    if (!isLoading && user && !user.currentOrganization && dialogRef) {
      dialogRef.current?.open({
        dialogProps: {
          disableBackdropClick: true,
          disableEscapeKeyDown: true,
        },
        title: t("Template.organizationSelect"),
        content: (
          <OrganizationList
            organizations={user.organizations}
            onChange={handlerOrganizationChange}
          />
        ),
        actions: [],
      });
    }
  }, [user, isLoading]);

  return (
    <ThemeProvider theme={theme}>
      <TemplateContext.Provider value={{ dialog: dialogRef, theme }}>
        <Hidden only={["xs", "sm"]}>
          {!isLoading && <ETKLayoutDesktop>{props.children}</ETKLayoutDesktop>}
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          {isLoading && <ETKLayoutMobile>{props.children}</ETKLayoutMobile>}
        </Hidden>
        <ETKDialog ref={dialogRef} />
      </TemplateContext.Provider>
    </ThemeProvider>
  );
}
