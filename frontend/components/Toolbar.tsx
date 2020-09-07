import React, { useState, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import dynamic from "next/dynamic";
import ETKContact from "./Contact";
import ETKLogout from './Logout';
import ETKSignin from './SignIn';
import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";
import Auth from './Auth.js';

export interface ETKToolbarProps {
  logo: string;
  numberOfTrees: string;
  loginText: string;
  logoutText: string;
  registerText: string;
  aboutText: string;
  onMenuClick: React.MouseEventHandler<HTMLElement>;
  onDarkToggle: ETKDarkToggleProps["onToggle"];
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

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const classes = useStyles();

  const ETKRegister = dynamic(() => import("../components/Register"), {
    ssr: false
  });

  const { session, setSession } = Auth.useSession()
  const [ isSigninOpen , setSigninOpen ] = useState(false)
  const [ isRegisterOpen , setRegisterOpen ] = useState(false)
  const [ isContactOpen, setIsContactOpen ] = useState(false);

  const renderWhenSession = () =>{

    const checkIsSuperUser = (session: any):boolean => {
      let token:[string,string,string];
      let payload:string;
      let payloadObj: {
        exp: number,
        sub: string,
        is_superuser: boolean
      };
      let toRet:boolean = false;

      payloadObj = {
        exp: -1,
        sub: '',
        is_superuser:false
      }

      if (session.length) {
        token = session.split('.');
      }
      if (token.length) {
        payload = atob(token[1]);
      }
      if (payload) {
        payloadObj = JSON.parse(payload)
      }
      if (payloadObj) {
        toRet = payloadObj.is_superuser ||  false;
      }

      return toRet
    }

    const isSuperUser = checkIsSuperUser(session)

    return(
      <React.Fragment>
        <ETKLogout
          logoutText={props.logoutText}
        />
        { isSuperUser &&
          <Button
          color="primary"
          onClick={() => {
            setSigninOpen(false);
            setRegisterOpen(true);
            setIsContactOpen(false);
          }}
          >
            {props.registerText}
          </Button>
        }

      </React.Fragment>
    )
  }
  const renderWhenNoSession= () => {
    return (
      <React.Fragment>
        <Hidden xsDown>
          <Button
            color="primary"
            onClick={(e) => {
              setSigninOpen(true);
            }}
          >
            {props.loginText}
          </Button>
        </Hidden>
      </React.Fragment>
    )
  }
  return (
    <AppBar className={classes.appBar} position="fixed" color="inherit">
      <Toolbar variant="dense">
        <IconButton edge="start" aria-label="menu" onClick={props.onMenuClick}>
          <MenuIcon />
        </IconButton>
        <img src={props.logo} className={classes.logo} />
        <Hidden smDown>
          <Typography
            component="h2"
            variant="h5"
            className={classes.numberOfTrees}
            color="primary"
          >
            {props.numberOfTrees}
          </Typography>
        </Hidden>
        <div className={classes.buttons}>
          { session
          ? renderWhenSession()
          : renderWhenNoSession()
          }
          <Hidden xsDown>
            <Button
              color="primary"
              onClick={() => {
                setSigninOpen(false);
                setRegisterOpen(false);
                setIsContactOpen(true);
              }}
            >
              {props.aboutText}
            </Button>
          </Hidden>
          <ETKDarkToggle onToggle={props.onDarkToggle} />
        </div>
      </Toolbar>
      <ETKSignin
        isOpen={isSigninOpen}
        onClose={ (e) => {
          setSigninOpen(false)
        }}
        titleText="Connexion"
      />
      <ETKRegister
        isOpen={ isRegisterOpen }
        onClose= {() => {
          setRegisterOpen(false)
        }}
        submitButtonText="Submit"
      />
      <ETKContact
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
        }}
      />
    </AppBar>
  );
};

export default ETKToolbar;
