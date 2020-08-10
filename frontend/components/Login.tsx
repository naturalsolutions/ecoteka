import { Fragment } from "react"
import { Button } from "@material-ui/core";
import Auth from './Auth.js';

export interface ETKLoginProps { }

const ETKLogin: React.FC<ETKLoginProps> = (props) => {
  const { session, setSession } = Auth.useSession()

  const onLogoutHandler = (e) => {
    setSession(null)
  }

  const onLoginHandler = async (e) => {
    const crendentials = {
      username: 'admin@ecoteka.natural-solutions.eu',
      password: 'password'
    }

    const responseLogin = await Auth.signIn(crendentials)
    setSession(responseLogin)
  }

  const login = (<Button onClick={onLoginHandler}>Login</Button>)
  const logout = (<Button onClick={onLogoutHandler}>Logout</Button>)

  return (
    <Fragment>{session ? logout : login}</Fragment>
  )
};

export default ETKLogin;
