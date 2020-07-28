import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

export interface ETKToolbarProps {
  logo: string;
  numberOfTrees: string;
  aboutText: string;
  onMenuClick: React.MouseEventHandler<HTMLElement>;
}

const useStyles = makeStyles(() => ({
  logo: {
    maxHeight: "40px",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  numberOfTrees: {
    width: "100%",
  },
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const classes = useStyles();

  return (
    <AppBar position="absolute" color="inherit">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={props.onMenuClick}
        >
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
          <div className={classes.buttons}>
            <Button color="primary">{props.aboutText}</Button>
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default ETKToolbar;
