import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

import ETKToolbar from "./Toolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    //display: "flex",
  },
  content: {
    //flexGrow: 1,
    position: 'relative',
    height: "calc(100vh - 96px)",
    marginTop: 96
  }
}));

export default function Template(props) {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const onDarkToggleHandler = (dark) => {
    const mapTheme = dark ? "light" : "dark";

    setCurrentTheme(mapTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} role="presentation">
        <ETKToolbar
          logo={`/assets/${currentTheme}/logo.svg`}
          numberOfTrees="4.6 millions of trees"
          aboutText="About"
          onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)}
          onDarkToggle={onDarkToggleHandler}
        />
        <main className={classes.content}>{props.children}</main>
      </div>
    </ThemeProvider>
  );
}