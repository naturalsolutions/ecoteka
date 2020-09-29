import { ETKErrorPage } from "@/ETKC";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  figcaption: {
    fontSize: "18px",
    padding: "20px",
  },
}));

export default function Page404() {
  const classes = useStyles();

  return (
    <ETKErrorPage>
      <figcaption className={classes.figcaption}>
        Aucun arbre n'a encore poussé sur cette page ...
      </figcaption>
    </ETKErrorPage>
  );
}
