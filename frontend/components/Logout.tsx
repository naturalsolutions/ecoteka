import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Auth from './Auth.js';


export interface ETKLogoutProps {
  logoutText:string;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    maxHeight: "40px",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  numberOfTrees: {
    width: "100%",
  },
}));

const ETKLogout: React.FC<ETKLogoutProps> = (props) => {
  const classes = useStyles(props);
  const { session, setSession } = Auth.useSession()

  return (
    <Button
      onClick={(e) => {
        setSession(false)
      }}
    >
      {props.logoutText}
    </Button>
  )

};

export default ETKLogout;