import ErrorPage from "@/components/ErrorPage";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  figcaption: {
    fontSize: "18px",
    padding: "20px",
    color: "#fff",
  },
}));

export default function Page500() {
  const classes = useStyles();

  return (
    <ErrorPage error="500">
      <figcaption className={classes.figcaption}>
        La météo ne nous est pas favorable ! <br />
        Attendez un peu et réessayez quand les nuages seront passés.
      </figcaption>
    </ErrorPage>
  );
}
