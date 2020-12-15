import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

export interface ETKErrorPageProps {
  buttonText?: string;
  captionText?: string;
  error?: string;
}

const defaultProps: ETKErrorPageProps = {
  buttonText: "Retourner sur la page initiale",
  captionText: "Designed by Pikisuperstar - fr.freepik.com",
  error: "404",
};

const ETKErrorPage: React.FC<ETKErrorPageProps> = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "calc(100vh - 48px)",
      width: "100vw",
      background: `no-repeat url('/assets/background_${props.error}.svg')`,
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

  const classes = useStyles();
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
          alt={`Erreur ${props.error}`}
          src={`/assets/erreur_${props.error}.svg`}
          width="400px"
        />
        {props.children}
      </figure>
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={onClick}
      >
        {props.buttonText}
      </Button>
      <Typography variant="caption" className={classes.credit}>
        {props.captionText}
      </Typography>
    </Grid>
  );
};

ETKErrorPage.defaultProps = defaultProps;

export default ETKErrorPage;
