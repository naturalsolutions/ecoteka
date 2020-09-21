import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ETKToolbar from "./Toolbar";
import { useAppContext } from "../providers/AppContext";
import themeConfig from "../theme/config";

const useStyles = makeStyles({
  content: {
    position: "relative",
  },
});

export default function Template(props) {
  const { user, setAppContext } = useAppContext();
  const sizeToolbar = user ? 96 : 48;
  const classes = useStyles();
  const styles = {
    height: `calc(100vh - ${sizeToolbar}px)`,
    marginTop: sizeToolbar,
  };
  const [currentTheme, setCurrentTheme] = useState("light");
  const theme = createMuiTheme(themeConfig(currentTheme));

  // TODO: force resize for mapbox :(
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [sizeToolbar]);

  const onDarkToggleHandler = (dark) => {
    const mapTheme = dark ? "light" : "dark";

    setAppContext({
      theme: mapTheme,
    });

    setCurrentTheme(mapTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} role="presentation">
        <ETKToolbar
          logo={`/assets/${currentTheme}/logo.svg`}
          numberOfTrees="4.6 millions of trees"
          aboutText="Nous contacter"
          loginText="Login"
          logoutText="Logout"
          registerText="Register"
          onDarkToggle={onDarkToggleHandler}
        />
        <main className={classes.content} style={styles}>
          {props.children}
        </main>
      </div>
    </ThemeProvider>
  );
}
