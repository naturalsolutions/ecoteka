import React from "react";
import { Hidden } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useAppContext } from "../providers/AppContext";
import themeConfig from "../theme/config";
import ETKDialog from "./Dialog";
import ETKLayoutDesktop from "./Layout/Desktop";
import ETKLayoutMobile from "./Layout/Mobile";

const TemplateContext = React.createContext(null);

export const useTemplate = () => React.useContext(TemplateContext);

export default function Template(props) {
  const dialogRef = React.useRef();
  const theme = createMuiTheme(themeConfig("dark"));

  return (
    <ThemeProvider theme={theme}>
      <TemplateContext.Provider value={{ dialog: dialogRef, theme }}>
        <Hidden only={["xs", "sm"]}>
          <ETKLayoutDesktop>{props.children}</ETKLayoutDesktop>
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
          <ETKLayoutMobile>{props.children}</ETKLayoutMobile>
        </Hidden>
        <ETKDialog ref={dialogRef} />
      </TemplateContext.Provider>
    </ThemeProvider>
  );
}
