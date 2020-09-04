import { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ETKContact from "./Contact";
import Link from "next/link";
import { useRouter } from 'next/router'

import Collapse from '@material-ui/core/Collapse';

import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";

export interface ETKToolbarProps {
  logo: string;
  numberOfTrees: string;
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
    background: '#CCC'
  },
  navBar: {
    display: "flex",
    paddingLeft: 5,
    '& > div': {
      '&:not(:last-child)': {
        marginRight: "30px"
      },
      '& > button': {
        minHeight: 48,
        borderRadius: 0,
        borderBottom: '2px solid transparent',
        '&.active': {
          borderBottomColor: '#000'
        }
      }
    },
    '& .level-2': {
      padding: '5px 0',
      '& .MuiButton-root': {
        display: 'block',
        textTransform: 'none'
      }
    }
  },
  numberOfTrees: {
    width: "100%",
  }
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const classes = useStyles();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [curLevel1, setCurLevel1] = useState('patrimony');

  const router = useRouter();

  //TODO
  const matchCurLevel1 = (url) => {
    const urlObj = new URL(url, 'http://anybase/');
    const drawerName = urlObj.searchParams.get('drawer');
    if (drawerName == 'import' || urlObj.pathname == '/imports') {
      setCurLevel1('import')
    } else if (drawerName == 'intervention_request') {
      setCurLevel1('intervention');
    } else {
      setCurLevel1('patrimony');
    }
  }

  useEffect(() => {
    const handleRouteChange = (url) => {
      matchCurLevel1(url);
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  const getLevel1ClassNames = (name) => {
    const classNames = {
      active: curLevel1 == name
    };

    return Object.keys(classNames).filter(key => {
      return Boolean(classNames[key]);
    }).join(' ');
  }

  useEffect(() => {
    matchCurLevel1(window.location.href);
  });

  return (
    <AppBar className={classes.appBar} position="fixed" color="inherit" elevation={4}>
      <Toolbar variant="dense" className={classes.toolbar}>
        {/* <IconButton edge="start" aria-label="menu" onClick={props.onMenuClick}>
          <MenuIcon />
        </IconButton> */}
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
          <Hidden smDown>
            <Button
              color="primary"
              onClick={() => {
                setIsContactOpen(true);
              }}
            >
              {props.aboutText}
            </Button>
          </Hidden>
          <ETKDarkToggle onToggle={props.onDarkToggle} />
        </div>
      </Toolbar>
      <Collapse in={isMenuOpen} collapsedHeight={48}>
        <div className={classes.navBar}>
          <div>
            <Button
              color="primary"
              className={getLevel1ClassNames('patrimony')}
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
              <Button size="small">
                Ajouter un arbre
              </Button>
              <Button size="small">
                Créer un espace de plantation
              </Button>
            </div>
          </div>
          <div>
            <Button
              color="primary"
              className={getLevel1ClassNames('intervention')}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              INTERVENTIONS
            </Button>
            <div className="level-2">
              <Button size="small">
                Calendrier des interventions
              </Button>
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
              className={getLevel1ClassNames('import')}
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
