import { FC } from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
}));

const KeysDescription: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography
      variant="subtitle1"
      component="div"
      className={classes.root}
      color="textSecondary"
    >
      {children}
    </Typography>
  );
};

export default KeysDescription;
