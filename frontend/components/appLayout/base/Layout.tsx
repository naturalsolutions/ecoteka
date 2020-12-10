import { FC, createContext, useRef, useContext } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Dialog, { TDialogActions } from "@/components/Dialog";
import themeConfig from "@/theme/config";

const AppLayoutContext = createContext(null);

export const useAppLayout = () => useContext(AppLayoutContext);

const AppLayoutBase: FC<{}> = ({ children }) => {
  const theme = createMuiTheme(themeConfig("dark"));
  const dialogRef = useRef<TDialogActions>(null);

  return (
    <ThemeProvider theme={theme}>
      <AppLayoutContext.Provider value={{ dialog: dialogRef, theme }}>
        {children}
        <Dialog ref={dialogRef} />
      </AppLayoutContext.Provider>
    </ThemeProvider>
  );
};

export default AppLayoutBase;
