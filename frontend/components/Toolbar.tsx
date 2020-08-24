import { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ETKContact from "./Contact";

import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";

export interface ETKToolbarProps {
  logo: string;
  numberOfTrees: string;
  aboutText: string;
  onMenuClick: React.MouseEventHandler<HTMLElement>;
  onDarkToggle: ETKDarkToggleProps["onToggle"];
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    maxHeight: "40px",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  navBar: {
    '& button:not(:last-child)': {
      marginRight: "30px"
    }
  },
  numberOfTrees: {
    width: "100%",
  }
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const classes = useStyles();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AppBar className={classes.appBar} position="fixed" color="inherit" elevation={isMenuOpen ? 0 : 4}>
      <Toolbar variant="dense">
        <IconButton edge="start" aria-label="menu" onClick={props.onMenuClick}>
          <MenuIcon />
        </IconButton>
        <img src={props.logo} className={classes.logo} />
        <Hidden smDown>
          <Typography
            component="h2"
            variant="h5"
            className={classes.numberOfTrees}
            color="primary"
          >
            {props.numberOfTrees}
          </Typography>
        </Hidden>
        <div className={classes.buttons}>
          <Hidden smDown>
            <Button
              color="primary"
              onClick={() => {
                setIsContactOpen(true);
              }}
            >
              {props.aboutText}
            </Button>
          </Hidden>
          <ETKDarkToggle onToggle={props.onDarkToggle} />
        </div>
      </Toolbar>
      <Collapse in={isMenuOpen} collapsedHeight={48}>
        <Paper elevation={4}>
          <Toolbar className={classes.navBar} variant="dense">
            <Button
              color="primary"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              PATRIMOINE VEGETAL
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              INTERVENTIONS
           </Button>
            <Button
              color="primary"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              iMPORT DE DONNEES
           </Button>
          </Toolbar>
          <div>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
          </Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
          </Typography>
          </div>
          <div>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
          </Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
              sit amet blandit leo lobortis eget.
          </Typography>
          </div>
        </Paper>
      </Collapse>
      <ETKContact
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
        }}
      />
    </AppBar>
  );
};

export default ETKToolbar;
