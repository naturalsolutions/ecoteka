import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Toolbar,
} from "@material-ui/core";
import ETKContactButton from "@/components/Contact/Button";
import ETKRegisterButton from "@/components/Register/Button";
import ETKLanguageSelector from "@/components/LanguageSelector";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import OrganizationSelect from "@/components/Organization/Select";
import { IOrganization } from "@/index";
import UserMainMenuButton from "@/components/User/MainMenuButton";

export interface ETKToolbarProps {
  logo: string;
}

const defaultProps: ETKToolbarProps = {
  logo: "/assets/dark/logo.svg",
};

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "35px",
    paddingTop: ".3rem",
  },
  toolbar: {
    backgroundColor: theme.palette.secondary.main,
  },
  numberOfTrees: {
    width: "100%",
  },
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const { user, setUser } = useAppContext();
  const router = useRouter();

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
              <Grid container justify="flex-end">
                <Grid item>
                  <ETKLanguageSelector />
                </Grid>

                <ETKContactButton />
                {user?.is_superuser && <ETKRegisterButton />}
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

ETKToolbar.defaultProps = defaultProps;

export default ETKToolbar;
