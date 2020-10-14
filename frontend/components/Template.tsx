import React, { useState, useEffect } from "react";
import { AppBar, makeStyles } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { GetApp, Star } from "@material-ui/icons";
import ETKToolbar from "./Toolbar";
import ETKMenu, { ETKMenuItem } from "./Menu";
import ETKDialog from "./Dialog";
import { useAppContext } from "../providers/AppContext";
import themeConfig from "../theme/config";

const useStyles = makeStyles({
  content: {
    position: "relative",
  },
});

const TemplateContext = React.createContext(null);

export const useTemplate = () => React.useContext(TemplateContext);

export default function Template(props) {
  const dialogRef = React.useRef();
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

  const menuItems = [
    {
      label: "Template.menuItems.plantHeritage.plantHeritage",
      children: [
        {
          label: "Template.menuItems.plantHeritage.allTrees",
          link: "/",
          activator: (router) =>
            router.pathname === "/" && router.query.drawer === undefined,
        },
        {
          label: "Template.menuItems.plantHeritage.addATree",
          link: "/treeedition",
          activator: (router) => router.pathname === "/treeedition",
        },
      ],
    },
    {
      label: "Template.menuItems.dataImport.dataImport",
      icon: <GetApp viewBox="0 -4 24 24" />,
      children: [
        {
          label: "Template.menuItems.dataImport.importYourData",
          link: "/?drawer=import",
          activator: (router) =>
            router.pathname === "/" && router.query.drawer === "import",
        },
        {
          label: "Template.menuItems.dataImport.importHistory",
          link: "/imports",
          activator: (router) => router.pathname === "/imports",
        },
      ],
    },
    {
      label: "Template.menuItems.availableSoon.availableSoon",
      icon: <Star viewBox="0 -4 24 24" />,
      disabled: true,
      highlighted: true,
      children: [
        {
          label: "Template.menuItems.availableSoon.requestAnItervention",
          disabled: true,
        },
        {
          label: "Template.menuItems.availableSoon.scheduleOfInterventions",
          disabled: true,
        },
      ],
    },
  ] as ETKMenuItem[];

  return (
    <ThemeProvider theme={theme}>
      <TemplateContext.Provider value={{ dialog: dialogRef.current, theme }}>
        <div role="presentation">
          <AppBar position="fixed">
            <ETKToolbar
              logo={`/assets/${currentTheme}/logo.svg`}
              registerText="Register"
              onDarkToggle={onDarkToggleHandler}
            />
            {user && <ETKMenu items={menuItems} />}
          </AppBar>
          <main className={classes.content} style={styles}>
            {props.children}
          </main>
        </div>
        <ETKDialog ref={dialogRef} />
      </TemplateContext.Provider>
    </ThemeProvider>
  );
}
