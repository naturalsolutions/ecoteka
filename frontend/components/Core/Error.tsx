import { FC } from "react";
import { makeStyles, Theme, Grid, Button, Typography } from "@material-ui/core";
import { useRouter } from "next/router";

export interface CoreErrorProps {
  errorCode: number;
  buttonText: string;
  captionText: string;
}

const useStyles = makeStyles<Theme, CoreErrorProps>((theme: Theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    background: ({ errorCode }) =>
      `no-repeat url('/assets/background_${errorCode}.svg')`,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  },
  figure: {
    padding: "100px 0px 30px 0px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
  },
  credit: {
    position: "absolute",
    bottom: "5px",
    right: "10px",
    color: "#fff",
  },
}));

const CoreError: FC<CoreErrorProps> = (props) => {
  const { errorCode, buttonText, captionText, children } = props;
  const classes = useStyles(props);
  const router = useRouter();
  const onClick = () => {
    router.push("/");
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.root}
    >
      <figure className={classes.figure}>
        <img
          alt={`Erreur ${errorCode}`}
          src={`/assets/erreur_${errorCode}.svg`}
          width="400px"
        />
        {children}
      </figure>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={onClick}
      >
        {buttonText}
      </Button>
      <Typography variant="caption" className={classes.credit}>
        {captionText}
      </Typography>
    </Grid>
  );
};

export default CoreError;
