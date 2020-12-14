import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import ETKContactButton from "@/components/Contact/Button";
import ETKLanguageSelector from "@/components/LanguageSelector";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import OrganizationSelect from "@/components/Organization/Select";
import { IOrganization } from "@/index";
import UserMainMenuButton from "@/components/User/MainMenuButton";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";

export interface ETKToolbarProps {
  logo: string;
}

const useStyles = makeStyles((theme) => {
  return {
    logo: {
      height: "35px",
      paddingTop: ".3rem",
    },
    toolbar: {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.secondary.main
          : theme.palette.background.default,
    },
    numberOfTrees: {
      width: "100%",
    },
  };
});

const ETKToolbar: React.FC<ETKToolbarProps> = (props): JSX.Element => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const { user, setUser } = useAppContext();
  const router = useRouter();
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
    router.push("/signin");
  };

  const renderWhenSession = () => {
    return (
      <>
        <Divider orientation="vertical" flexItem />
        <UserMainMenuButton />
      </>
    );
  };

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar} variant="dense">
        <Grid container alignItems="center">
          <Grid item xs={12} sm={6}>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <img src={props.logo} className={classes.logo} />
              </Grid>
              {user && (
                <Grid item>
                  <OrganizationSelect
                    user={user}
                    onChange={handleOrganizationSelectChange}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid item xs={12} sm={6}>
              <Grid
                container
                justify="flex-end"
                direction="row"
                alignItems="center"
              >
                <Grid item>
                  <IconButton onClick={() => setDark(!dark)}>
                    {dark ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Grid>
                <Grid item>
                  <ETKLanguageSelector />
                </Grid>

                {!user && <ETKContactButton />}
                {user && renderWhenSession()}
                {!user && (
                  <Button onClick={handleSignInClick}>
                    {t("SignIn.buttonConnexion")}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Toolbar>
    </React.Fragment>
  );
};

export default ETKToolbar;
