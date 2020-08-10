import { Button } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Auth from './Auth.js';

export interface ETKLoginProps { }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({})
);

const onClickHandler = (e) => {
  const crendentials = {
    username: 'admin@ecoteka.natural-solutions.eu',
    password: 'password'
  }

  Auth.signIn(crendentials)
}

const ETKLogin: React.FC<ETKLoginProps> = (props) => {
  const classes = useStyles();

  return (
    <Button onClick={onClickHandler}>
      Login
    </Button>
  );
};

export default ETKLogin;
