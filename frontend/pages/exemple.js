import PanelWelcome from "../components/Panel/Welcome";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({}));

export default function Page404() {
  const classes = useStyles();

  return <PanelWelcome></PanelWelcome>;
}
