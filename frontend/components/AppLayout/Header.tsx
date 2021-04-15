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
import { EcotekaTheme } from "@/theme/config";
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
import Link from "next/link";

const useStyles = makeStyles((theme: EcotekaTheme) => ({
  logo: {
    height: 35,
    paddingTop: ".3rem",
    cursor: "pointer",
  },
  toolbar: {
    backgroundColor: theme.palette.toolbar,
  },
}));

const AppLayoutHeader = ({}): JSX.Element => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const router = useRouter();
  const { user, organization } = useAppContext();
  const { dark, setDark, theme } = useThemeContext();
  const [logo, setLogo] = useState("/assets/light/logo-mobile.svg");
  const [menu, setMenu] = useState<string | null>(router.asPath);
  const [showMenuItems, setShowMenuItems] = useState<boolean>(false);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const ability = useContext(AbilityContext);

  const handleOrganizationSelectChange = (organization: IOrganization) => {
    router.push({
      query: {
        organizationSlug: organization.slug,
      },
    });
  };

  useEffect(() => {
    setLogo(
      `/assets/${dark ? "dark" : "light"}/logo${matches ? "-mobile" : ""}.svg`
    );
  }, [dark, matches]);

  useEffect(() => {
    setMenu(router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (
      [
        "/[organizationSlug]/map",
        "/[organizationSlug]/scheduler",
        "/[organizationSlug]/imports",
      ].includes(router.route)
    ) {
      setShowMenuItems(true);
    } else {
      setShowMenuItems(false);
    }
  }, [router.route]);

  const handleSignInClick = () => {
    router.push("/signin");
  };

  const menuItems = [
    {
      link: "/[organizationSlug]",
      icon: <DashboardIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/[organizationSlug]/map",
      icon: <MapIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/[organizationSlug]/scheduler",
      icon: <TodayIcon fontSize="small" />,
      do: "read",
      on: "Trees",
    },
    {
      link: "/[organizationSlug]/imports",
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
              <Link href="/">
                <img src={logo} className={classes.logo} />
              </Link>
            </Grid>
            {showMenuItems && (
              <>
                <OrganizationSelect
                  user={user}
                  organization={organization}
                  onChange={handleOrganizationSelectChange}
                />
                <Hidden smDown>
                  <ToggleButtonGroup value={menu} size="small">
                    {menuItems.map(
                      (menuItem, key) =>
                        ability.can(
                          menuItem.do as Actions,
                          menuItem.on as Subjects
                        ) && (
                          <ToggleButton
                            key={key}
                            value={menuItem.link}
                            onClick={() =>
                              router.push({
                                pathname: menuItem.link,
                                query: {
                                  organizationSlug: organization.slug,
                                },
                              })
                            }
                          >
                            {menuItem.icon}
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
