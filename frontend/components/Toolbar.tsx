import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import Divider from "@material-ui/core/Divider";
import MoodIcon from "@material-ui/icons/Mood";
import dynamic from "next/dynamic";
import ETKContact from "./Contact";
import ETKSignin from "./SignIn";
import Link from "next/link";
import { useRouter } from "next/router";

import Collapse from "@material-ui/core/Collapse";
import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";

import { useAppContext } from "../providers/AppContext";
import { apiRest } from "../lib/api";

export interface ETKToolbarProps {
  logo: string;
  numberOfTrees: string;
  loginText: string;
  logoutText: string;
  registerText: string;
  aboutText: string;
  onDarkToggle: ETKDarkToggleProps["onToggle"];
  onMenuClick?(index: string): void;
}

const defaultProps: ETKToolbarProps = {
  logo: "/assets/light/logo.svg",
  numberOfTrees: "4.6 millions of trees",
  loginText: "Login",
  logoutText: "Déconnexion",
  registerText: "S'inscrire",
  aboutText: "Nous contacter",
  onDarkToggle: () => {},
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    maxHeight: "40px",
  },
  toolbar: {
    background: "#8b8b8b",
    color: "#fff",
  },
  toolbarButton: {
    color: "#fff",
  },
  userInfosPaper: {
    padding: 10,
    textAlign: "center",
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
  const { user, setUser } = useAppContext();

  const ETKRegister = dynamic(() => import("../components/Register"), {
    ssr: false,
  });

  const [isSigninOpen, setSigninOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [curLevel1, setCurLevel1] = useState("patrimony");

  const [userInfosAnchorEl, setUserInfosAnchorEl] = React.useState(null);
  const isUserInfosOpen = Boolean(userInfosAnchorEl);

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

  const renderUserInfos = () => {
    return (
      <Popover
        classes={{
          paper: classes.userInfosPaper,
        }}
        open={isUserInfosOpen}
        anchorEl={userInfosAnchorEl}
        onClose={() => {
          setUserInfosAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <p>
          <MoodIcon />
        </p>
        {user.full_name && <p>{user.full_name}</p>}
        <p>{user.email}</p>
        <div>
          <Button
            onClick={(e) => {
              setUserInfosAnchorEl(null);
              apiRest.auth.logout();
              setUser(null);
            }}
          >
            {props.logoutText}
          </Button>
        </div>
      </Popover>
    );
  };

  const renderWhenSession = () => {
    //TODO Find something to display in any case ?
    const displayName =
      user.full_name || user.email.substr(0, user.email.indexOf("@"));
    return (
      <React.Fragment>
        {/* <ETKLogout logoutText={props.logoutText} /> */}
        {user.is_superuser ? (
          <Button
            className={classes.toolbarButton}
            onClick={() => {
              setSigninOpen(false);
              setRegisterOpen(true);
              setIsContactOpen(false);
            }}
          >
            {props.registerText}
          </Button>
        ) : null}
        {/* TODO apply theme on backgroundColor */}
        <Divider
          orientation="vertical"
          flexItem
          style={{
            backgroundColor: "#FFF",
          }}
        />
        <Button
          className={classes.toolbarButton}
          onClick={(e) => {
            setUserInfosAnchorEl(e.currentTarget);
          }}
        >
          {displayName}
        </Button>
        {renderUserInfos()}
      </React.Fragment>
    );
  };

  const renderWhenNoSession = () => {
    return (
      <React.Fragment>
        <Hidden xsDown>
          <Button
            className={classes.toolbarButton}
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
        <Grid container alignItems="center">
          <img src={props.logo} className={classes.logo} />
          <Hidden smDown>
            <Grid item>
              <Typography
                component="h2"
                variant="h5"
                className={classes.numberOfTrees}
              >
                {props.numberOfTrees}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item style={{ marginLeft: "1rem" }}>
            <ETKDarkToggle onToggle={props.onDarkToggle} />
          </Grid>
        </Grid>

        <Grid container justify="flex-end">
          <Hidden xsDown>
            <Button
              className={classes.toolbarButton}
              onClick={() => {
                setSigninOpen(false);
                setRegisterOpen(false);
                setIsContactOpen(true);
              }}
            >
              {props.aboutText}
            </Button>
          </Hidden>
          {user ? renderWhenSession() : renderWhenNoSession()}
        </Grid>
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
      {user && (
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
                IMPORT DE DONNEES
              </Button>
              <div className="level-2">
                <Link href="/?drawer=import" passHref>
                  <Button size="small" component="a">
                    Importer vos données
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
      )}
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
