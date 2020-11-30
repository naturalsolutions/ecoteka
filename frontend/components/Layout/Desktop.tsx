import React from "react";
import { makeStyles, AppBar } from "@material-ui/core";
import ETKMenu, { ETKMenuItem } from "../Menu";
import ETKToolbar from "../Toolbar";
import { GetApp, Star } from "@material-ui/icons";
import { useAppContext } from "../../providers/AppContext";

export interface ETKLayoutDesktopProps {}

const defaultProps: ETKLayoutDesktopProps = {};

const useStyles = makeStyles({
  content: {
    position: "relative",
    backgroundColor: "#666666",
  },
});

const ETKLayoutDesktop: React.FC<ETKLayoutDesktopProps> = (props) => {
  const classes = useStyles();
  const { user } = useAppContext();
  const sizeToolbar = user ? 96 : 48;
  const styles = {
    height: `calc(100vh - ${sizeToolbar}px)`,
    marginTop: sizeToolbar,
  };
  let menuItems = [];

  if (user) {
    menuItems = [
      {
        label: "Template.menuItems.plantHeritage.plantHeritage",
        children: [
          {
            label: "Template.menuItems.plantHeritage.allTrees",
            link: "/",
            activator: (router) =>
              router.pathname === "/" && router.query.panel === undefined,
          },
          {
            label: "Template.menuItems.plantHeritage.cartographyEdition",
            link: "/edition/",
            activator: (router) => router.pathname === "/edition/",
          },
        ],
      },
      {
        label: "Template.menuItems.dataImport.dataImport",
        icon: <GetApp viewBox="0 -4 24 24" />,
        children: [
          {
            label: "Template.menuItems.dataImport.importYourData",
            link: "/?panel=import",
            activator: (router) =>
              router.pathname === "/" && router.query.panel === "import",
          },
          {
            label: "Template.menuItems.dataImport.importHistory",
            link: "/imports/",
            activator: (router) => router.pathname === "/imports/",
          },
        ],
      },
      {
        label: "Template.menuItems.intervention.intervention",
        icon: <Star viewBox="0 -4 24 24" />,
        children: [
          {
            label: "Template.menuItems.intervention.requestAnItervention",
            link: "/?panel=newIntervention",
            activator: (router) =>
              router.pathname === "/" &&
              router.query.panel === "newIntervention",
          },
          {
            label: "Template.menuItems.intervention.scheduleOfInterventions",
            link: `/scheduler/`,
            activator: (router) => router.pathname === `/scheduler/`,
          },
        ],
      },
    ] as ETKMenuItem[];
  }

  return (
    <div role="presentation">
      <AppBar position="fixed">
        <ETKToolbar logo={`/assets/dark/logo.svg`} />
        {user && <ETKMenu items={menuItems} />}
      </AppBar>
      <main className={classes.content} style={styles}>
        {props.children}
      </main>
    </div>
  );
};

ETKLayoutDesktop.defaultProps = defaultProps;

export default ETKLayoutDesktop;
