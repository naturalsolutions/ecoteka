import { FC } from "react";
import { makeStyles, Theme, Grid, Button, Typography } from "@material-ui/core";

export interface CoreErrorProps {
  errorCode: number;
  buttonText: string;
  errorMessage: string;
  captionText: string;
  onClick?: () => void;
}

const useStyles = makeStyles<Theme, CoreErrorProps>((theme: Theme) => ({
  root: {
    width: "100%",
    height: "300px",
    background: ({ errorCode }) =>
      `no-repeat url('/assets/background_${errorCode}.svg')`,
    backgroundSize: "cover",
  },
  figure: {
    padding: "40px 0px 30px 0px",
    textAlign: "center",
  },
  image: {
    width: "80%",
  },
  button: {
    padding: "10px 20px",
  },
  message: {},
  credit: {
    position: "absolute",
    bottom: "5px",
    right: "10px",
    color: "#fff",
  },
  [theme.breakpoints.up("sm")]: {
    root: {
      width: "100vw",
    },
    image: {
      width: "80%",
    },
  },
}));

const CoreError: FC<CoreErrorProps> = (props) => {
  const {
    errorCode,
    buttonText,
    errorMessage,
    captionText,
    onClick,
    children,
  } = props;
  const classes = useStyles(props);

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <figure className={classes.figure}>
          <img
            className={classes.image}
            alt={`Erreur ${errorCode}`}
            src={`/assets/erreur_${errorCode}.svg`}
          />
          {children}
        </figure>
      </Grid>
      <Grid item>
        <Typography variant="caption" className={classes.message}>
          {errorMessage}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="caption" className={classes.credit}>
          {captionText}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CoreError;
