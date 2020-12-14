import React, { useEffect, useMemo } from "react";
import { Hidden } from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";
import ETKDialog, { ETKDialogActions } from "@/components/Dialog";
import ETKLayoutDesktop from "@/components/Layout/Desktop";
import ETKLayoutMobile from "@/components/Layout/Mobile";
import OrganizationList from "@/components/Organization/List";
import { useTranslation } from "react-i18next";
import ThemeProvider from "@/lib/hooks/useThemeSwitcher";
import Snackbars from "@/components/Snackbars";

const TemplateContext = React.createContext(null);

export const useTemplate = () => React.useContext(TemplateContext);

export default function Template(props) {
  const { t } = useTranslation(["components"]);
  const { isLoading, user, setUser } = useAppContext();

  const snackRef = React.useRef();
  const dialogRef = React.useRef<ETKDialogActions>(null);

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
    <ThemeProvider>
      <TemplateContext.Provider
        value={{ dialog: dialogRef, snackbar: snackRef }}
      >
        <Hidden only={["xs", "sm"]}>
          {!isLoading && <ETKLayoutDesktop>{props.children}</ETKLayoutDesktop>}
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          {isLoading && <ETKLayoutMobile>{props.children}</ETKLayoutMobile>}
        </Hidden>
        <ETKDialog ref={dialogRef} />
        <Snackbars ref={snackRef} />
      </TemplateContext.Provider>
    </ThemeProvider>
  );
}
