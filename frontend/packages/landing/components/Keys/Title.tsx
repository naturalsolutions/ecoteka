import { FC } from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: "1rem",
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
}));

const KeysTitle: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography
      component="h4"
      variant="h4"
      className={classes.root}
      color="textPrimary"
    >
      {children}
    </Typography>
  );
};

export default KeysTitle;
