import { Grid, makeStyles, createStyles, Theme } from "@material-ui/core";
import { FC } from "react";

interface KeysContainerProps {
  reverse?: boolean;
}

const useStyles = makeStyles<Theme, KeysContainerProps>((theme) =>
  createStyles({
    root: {
      flexDirection: "column",
      marginBottom: "2rem",
      [theme.breakpoints.up("sm")]: {
        marginBottom: 80,
        flexDirection: (props) => (props.reverse ? "row-reverse" : "row"),
      },
    },
  })
);

const KeysContainer: FC<KeysContainerProps> = ({
  reverse = true,
  children,
}) => {
  const classes = useStyles({ reverse });

  return (
    <Grid className={classes.root} container alignItems="center">
      {children}
    </Grid>
  );
};

export default KeysContainer;
