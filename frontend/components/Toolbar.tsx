import React, { useState, useEffect } from "react";
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
import ETKLogout from "./Logout";
import ETKSignin from "./SignIn";
import Link from "next/link";
import { useRouter } from "next/router";

import Collapse from "@material-ui/core/Collapse";
import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";

import { useAppContext } from "../providers/AppContext";

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
  toolbar: {
    background: "#CCC",
  },
  navBar: {
    display: "flex",
    paddingLeft: 5,
    "& > div": {
      "&:not(:last-child)": {
        marginRight: "30px",
      },
      "& > button": {
        minHeight: 48,
        borderRadius: 0,
        borderBottom: "2px solid transparent",
        "&.active": {
          borderBottomColor: "#000",
        },
      },
    },
    "& .level-2": {
      padding: "5px 0",
      "& .MuiButton-root": {
        display: "block",
        textTransform: "none",
      },
    },
  },
  numberOfTrees: {
    width: "100%",
  },
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const classes = useStyles();
  const { appContext } = useAppContext();

  const ETKRegister = dynamic(() => import("../components/Register"), {
    ssr: false,
  });

  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [curLevel1, setCurLevel1] = useState("patrimony");

  const router = useRouter();

  //TODO
  const matchCurLevel1 = (url) => {
    const urlObj = new URL(url, "http://anybase/");
    const drawerName = urlObj.searchParams.get("drawer");
    if (drawerName == "import" || urlObj.pathname == "/imports") {
      setCurLevel1("import");
    } else if (drawerName == "intervention_request") {
      setCurLevel1("intervention");
    } else {
      setCurLevel1("patrimony");
    }
  };

  useEffect(() => {
    const handleRouteChange = (url) => {
      matchCurLevel1(url);
      setIsMenuOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const getLevel1ClassNames = (name) => {
    const classNames = {
      active: curLevel1 == name,
    };

    return Object.keys(classNames)
      .filter((key) => {
        return Boolean(classNames[key]);
      })
      .join(" ");
  };

  useEffect(() => {
    matchCurLevel1(window.location.href);
  });

  const renderWhenSession = () => {
    return (
      <React.Fragment>
        <ETKLogout logoutText={props.logoutText} />
        {appContext.user.is_superuser ? (
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
        ) : null}
      </React.Fragment>
    );
  };

  const renderWhenNoSession = () => {
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
    );
  };
  return (
    <AppBar
      className={classes.appBar}
      position="fixed"
      color="inherit"
      elevation={4}
    >
      <Toolbar variant="dense" className={classes.toolbar}>
        {
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={props.onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        }
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
          {appContext.user ? renderWhenSession() : renderWhenNoSession()}
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
        onClose={(e) => {
          setSigninOpen(false);
        }}
        titleText="Connexion"
      />
      <ETKRegister
        isOpen={isRegisterOpen}
        onClose={() => {
          setRegisterOpen(false);
        }}
        submitButtonText="Submit"
      />
      <Collapse in={isMenuOpen} collapsedHeight={48}>
        <div className={classes.navBar}>
          <div>
            <Button
              color="primary"
              className={getLevel1ClassNames("patrimony")}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              PATRIMOINE VEGETAL
            </Button>
            <div className="level-2">
              <Link href="/" passHref>
                <Button size="small" component="a">
                  Tous les arbres
                </Button>
              </Link>
              <Button size="small">Ajouter un arbre</Button>
              <Button size="small">Créer un espace de plantation</Button>
            </div>
          </div>
          <div>
            <Button
              color="primary"
              className={getLevel1ClassNames("intervention")}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              INTERVENTIONS
            </Button>
            <div className="level-2">
              <Button size="small">Calendrier des interventions</Button>
              <Link href="/?drawer=intervention_request" passHref>
                <Button size="small" component="a">
                  Demander une intervention
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Button
              color="primary"
              className={getLevel1ClassNames("import")}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              iMPORT DE DONNEES
            </Button>
            <div className="level-2">
              <Link href="/?drawer=import" passHref>
                <Button size="small" component="a">
                  Importer des données
                </Button>
              </Link>
              <Link href="/imports" passHref>
                <Button size="small" component="a">
                  Historique des imports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Collapse>
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
