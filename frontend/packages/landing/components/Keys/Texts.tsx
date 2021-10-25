import { FC } from "react";
import { Grid, makeStyles, Theme } from "@material-ui/core";

export interface KeysTextsProps {}

const useStyles = makeStyles<Theme, KeysTextsProps>((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
}));

const KeysTexts: FC<KeysTextsProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={8} className={classes.root}>
      <Grid container direction="column">
        {children}
      </Grid>
    </Grid>
  );
};

export default KeysTexts;
