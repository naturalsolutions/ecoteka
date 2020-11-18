import React from "react";
import Div100vh from "react-div-100vh";
import {
  makeStyles,
  BottomNavigationAction,
  BottomNavigation,
  Grid,
} from "@material-ui/core";
import { useAppContext } from "../../providers/AppContext";
import ETKButtonContact from "../Contact/Button";
import { useTranslation } from "react-i18next";

export interface ETKLayoutDesktopProps {}

const defaultProps: ETKLayoutDesktopProps = {};

const useStyles = makeStyles({
  grid: {
    height: "100%",
  },
});

const ETKLayoutDesktop: React.FC<ETKLayoutDesktopProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Div100vh>
      <Grid container direction="column" className={classes.grid}>
        <Grid item xs>
          {props.children}
        </Grid>
        <Grid item>
          <BottomNavigation showLabels>
            <BottomNavigationAction label={t("Layout.Mobile.treeHeritage")} />
            <ETKButtonContact />
          </BottomNavigation>
        </Grid>
      </Grid>
    </Div100vh>
  );
};

ETKLayoutDesktop.defaultProps = defaultProps;

export default ETKLayoutDesktop;
