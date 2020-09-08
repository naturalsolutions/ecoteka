import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

import ETKToolbar from "./Toolbar";
import { useAppContext } from "../providers/AppContext";

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
  const theme = createMuiTheme({
    palette: {
      type: currentTheme,
      primary: {
        main: currentTheme === "light" ? "#01685a" : "#fff",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: red.A400,
      },
      background: {
        default: "#fff",
      },
    },
  });

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
          aboutText="About"
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
