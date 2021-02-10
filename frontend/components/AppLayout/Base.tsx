import { FC, createContext, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@/lib/hooks/useThemeSwitcher";
import AppLayoutHeader from "@/components/AppLayout/Header";
import Dialog, { ETKDialogActions } from "@/components/Dialog";
import Snackbars from "@/components/Snackbars";
import { NoSsr } from "@material-ui/core";

const AppLayout = createContext(null);

export const useAppLayout = () => useContext(AppLayout);

const AppLayoutBase: FC = ({ children }) => {
  const { t } = useTranslation(["common", "components"]);
  const snackbar = useRef();
  const dialog = useRef<ETKDialogActions>(null);

  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={4}>
        <AppLayout.Provider value={{ dialog, snackbar, t }}>
          <NoSsr>
            <AppLayoutHeader />
            {children}
            <Dialog ref={dialog} />
            <Snackbars ref={snackbar} />
          </NoSsr>
        </AppLayout.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default AppLayoutBase;
