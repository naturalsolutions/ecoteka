import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Hidden,
  makeStyles,
  Toolbar,
  IconButton,
  useMediaQuery,
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
import SettingsSystemDaydreamIcon from "@material-ui/icons/SettingsSystemDaydream";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import MapIcon from "@material-ui/icons/Map";
import TodayIcon from "@material-ui/icons/CalendarToday";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { AbilityContext } from "@/components/Can";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";

const useStyles = makeStyles((theme) => {
  return {
    logo: {
      height: 35,
      paddingTop: ".3rem",
      cursor: "pointer",
    },
    toolbar: {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.secondary.main
          : theme.palette.background.default,
    },
  };
});

const AppLayoutHeader = ({}): JSX.Element => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const { dark, setDark, theme } = useThemeContext();
  const [logo, setLogo] = useState("/assets/light/logo-mobile.svg");
  const [menu, setMenu] = useState<string | null>(router.asPath);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const ability = useContext(AbilityContext);

  const handleOrganizationSelectChange = (organization: IOrganization) => {
    if (!organization || !organization.id) {
      return;
    }

    const newUser = { ...user };
    newUser.currentOrganization = organization;
    setUser(newUser);
  };

  useEffect(() => {
    setLogo(
      `/assets/${dark ? "dark" : "light"}/logo${matches ? "-mobile" : ""}.svg`
    );
  }, [dark, matches]);

  useEffect(() => {
    setMenu(router.asPath);
  }, [router.asPath]);

  const handleSignInClick = () => {
    router.push("/signin");
  };

  const menuItems = [
    {
      link: "/map?panel=start",
      icon: <MapIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/scheduler",
      icon: <TodayIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/dashboard",
      icon: <DashboardIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/imports",
      icon: <SettingsSystemDaydreamIcon fontSize="small" />,
      do: "create",
      on: "Trees",
    },
  ];

  return (
    <Toolbar className={classes.toolbar} variant="dense">
      <Grid container alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <img
                onClick={() => router.push(user ? "/map" : "/")}
                src={logo}
                className={classes.logo}
              />
            </Grid>
            {user && (
              <>
                <OrganizationSelect
                  user={user}
                  onChange={handleOrganizationSelectChange}
                />
                <Hidden smDown>
                  <ToggleButtonGroup value={menu} size="small">
                    {menuItems.map(
                      (i, k) =>
                        ability.can(i.do as Actions, i.on as Subjects) && (
                          <ToggleButton
                            key={k}
                            value={i.link}
                            onClick={() => router.push(i.link)}
                          >
                            {i.icon}
                          </ToggleButton>
                        )
                    )}
                  </ToggleButtonGroup>
                </Hidden>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item xs />
        <Grid item>
          <Grid
            container
            alignItems="center"
            justify="flex-end"
            direction="row"
          >
            <Grid item>
              <LanguageSelector />
            </Grid>
            <Grid item>
              <IconButton onClick={() => setDark(!dark)}>
                {dark ? (
                  <Brightness7Icon fontSize="small" />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
            </Grid>
            {!user && (
              <Hidden smDown>
                <Grid item>
                  <ContactButton />
                </Grid>
              </Hidden>
            )}
            {user && (
              <Grid item>
                <UserMainMenuButton />
              </Grid>
            )}
            {!user && (
              <Button size="small" onClick={handleSignInClick}>
                {t("components.SignIn.buttonConnexion")}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export default AppLayoutHeader;
