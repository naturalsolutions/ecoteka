import { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Box,
  makeStyles,
  Toolbar,
  withStyles,
  NoSsr,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";
import ContactButton from "@/components/Contact/Button";
import LanguageSelector from "@/components/LanguageSelector";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import OrganizationSelect from "@/components/Organization/Select";
import { IOrganization } from "@/index";
import UserMainMenuButton from "@/components/User/MainMenuButton";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import MapIcon from "@material-ui/icons/Map";
import TodayIcon from "@material-ui/icons/Today";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MenuIcon from "@material-ui/icons/Menu";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const useStyles = makeStyles((theme) => {
  return {
    logo: {
      height: 35,
      paddingTop: ".3rem",
    },
    toolbar: {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.secondary.main
          : theme.palette.background.default,
    },
  };
});

const LogoWrapperButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    border: "none",
    borderRadius: "0px",
    backgroundColor: "none",
    borderColor: "none",
    "&:hover": {
      backgroundColor: "none",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "none",
      borderColor: "none",
    },
    "&:focus": {
      boxShadow: "none",
      backgroundColor: "rgba(0,0,0,.1)",
    },
  },
})(Button);

const Logo = () => {
  const { dark } = useThemeContext();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Grid item>
      <LogoWrapperButton onClick={() => router.push("/")} disableFocusRipple>
        <img
          src={`/assets/${dark ? "dark" : "light"}/logo.svg`}
          className={classes.logo}
        />
      </LogoWrapperButton>
    </Grid>
  );
};

const OnlyAuthenticated = ({ children }) => {
  const { user } = useAppContext();

  return user ? children : null;
};

const NotAuthenticated = ({ children }) => {
  const { user } = useAppContext();

  return !user ? children : null;
};

const HeaderDesktop = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const { t } = useTranslation("components");
  const { dark, setDark } = useThemeContext();

  const handleOrganizationSelectChange = (organization: IOrganization) => {
    if (!organization || !organization.id) {
      return;
    }

    const newUser = { ...user };
    newUser.currentOrganization = organization;
    setUser(newUser);
  };

  const handleSignInClick = () => {
    router.push("/signin/");
  };

  return (
    <Toolbar className={classes.toolbar} variant="dense">
      <Grid container alignItems="center">
        <Logo />
        <NoSsr>
          <OnlyAuthenticated>
            <Grid item>
              <OrganizationSelect
                user={user}
                onChange={handleOrganizationSelectChange}
              />
            </Grid>

            <Grid item>
              <ToggleButtonGroup value={router.asPath} size="small">
                <ToggleButton
                  value="/edition/"
                  onClick={() => router.push("/edition/")}
                >
                  <MapIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                  value="/scheduler/"
                  onClick={() => router.push("/scheduler/")}
                >
                  <TodayIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                  value="/dashboard/"
                  onClick={() => router.push("/dashboard/")}
                >
                  <DashboardIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </OnlyAuthenticated>
          <Grid item xs />
          <NoSsr>
            <Grid item>
              <Box mx={1}>
                <ToggleButton
                  size="small"
                  value={dark}
                  selected={dark}
                  color="primary"
                  onClick={() => setDark(!dark)}
                >
                  {dark || false ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </ToggleButton>
              </Box>
            </Grid>
          </NoSsr>
          <Grid item>
            <LanguageSelector />
          </Grid>
          <NotAuthenticated>
            <Grid item>
              <ContactButton />
            </Grid>
          </NotAuthenticated>
          <OnlyAuthenticated>
            <Grid item>
              {" "}
              <UserMainMenuButton />
            </Grid>
          </OnlyAuthenticated>
          <NotAuthenticated>
            <Grid item>
              <Button onClick={handleSignInClick}>
                {t("components.SignIn.buttonConnexion")}
              </Button>
            </Grid>
          </NotAuthenticated>
        </NoSsr>
      </Grid>
    </Toolbar>
  );
};

const MenuMobile = ({ isOpen = true, setOpen }) => {
  const { t } = useTranslation("components");
  const router = useRouter();

  const handleAction = (route) => {
    setOpen(false);
    router.push(route);
  };

  return (
    isOpen && (
      <Card
        square={true}
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1300,
          background: "#f6faf8",
        }}
      >
        <CardContent>
          <Grid container justify="flex-end">
            <Grid item>
              <LanguageSelector />
            </Grid>
          </Grid>
          <List>
            <ListItem onClick={() => handleAction("/dashboard/")}>
              Dashboard
            </ListItem>
            <ListItem onClick={() => handleAction("/edition/")}>Map</ListItem>
            <ListItem onClick={() => handleAction("/scheduler/")}>
              Calendar
            </ListItem>
            <ListItem>Logout</ListItem>
          </List>
          <NotAuthenticated>
            <Grid item>
              <Box textAlign="right">
                <Button
                  color="primary"
                  onClick={() => handleAction("/signin/")}
                >
                  {t("components.SignIn.buttonConnexion")}
                </Button>
              </Box>
            </Grid>
          </NotAuthenticated>
        </CardContent>
      </Card>
    )
  );
};

const HeaderMobile = () => {
  const classes = useStyles();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <Toolbar className={classes.toolbar} variant="dense">
      <Grid container alignItems="center">
        <Logo />
        <Grid item xs></Grid>
        <Grid item>
          <IconButton
            onClick={(e) => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <MenuMobile isOpen={isMenuOpen} setOpen={setIsMenuOpen} />
      </Grid>
    </Toolbar>
  );
};

const AppLayoutHeader = ({}): JSX.Element => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const setResponsiveness = () => {
      setIsMobile(window.innerWidth < 900);
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
};

export default AppLayoutHeader;
