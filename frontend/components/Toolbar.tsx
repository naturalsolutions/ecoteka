import React from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ETKContactButton from "./Contact/Button";
import ETKRegisterButton from "./Register/Button";
import ETKLogout from "./Logout";
import ETKLanguageSelector from "./LanguageSelector";
import { useAppContext } from "../providers/AppContext";
import { useRouter } from "next/router";
import OrganizationSelect from "@/components/Organization/Select";
import { IOrganization } from "@/index";

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
  userInfosPaper: {
    padding: 10,
    textAlign: "center",
  },
  numberOfTrees: {
    width: "100%",
  },
}));

const ETKToolbar: React.FC<ETKToolbarProps> = (props) => {
  const { t } = useTranslation("components");
  const classes = useStyles();
  const { user, setUser } = useAppContext();

  const [userInfosAnchorEl, setUserInfosAnchorEl] = React.useState(null);
  const isUserInfosOpen = Boolean(userInfosAnchorEl);

  const router = useRouter();

  const handleOrganizationSelectChange = (organization: IOrganization) => {
    const newUser = { ...user };

    newUser.currentOrganization = organization;
    setUser(newUser);
  };

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
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Avatar>
                  {user.full_name
                    .split(" ")
                    .slice(0, 2)
                    .map((s) => s[0].toUpperCase())}
                </Avatar>
              </Grid>
              <Grid item xs>
                {user.email}
              </Grid>
            </Grid>
          </Grid>
          <Box mt={2} mb={1}>
            <Divider />
          </Box>
          <Grid>
            <Button
              onClick={() =>
                router.push(`/organization/${user.organizations[0].id}`)
              }
            >
              {t("Toolbar.myOrganizations")}
            </Button>
          </Grid>
          <Grid item>
            <ETKLogout
              onClick={() => {
                setUserInfosAnchorEl(null);
              }}
            />
          </Grid>
        </Grid>
      </Popover>
    );
  };

  const renderWhenSession = () => {
    //TODO Find something to display in any case ?
    const displayName =
      user.full_name || user.email.substr(0, user.email.indexOf("@"));
    return (
      <React.Fragment>
        <Divider orientation="vertical" flexItem />
        <Button
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
              <Grid item>
                <Hidden smDown>
                  <Typography
                    color="textPrimary"
                    component="h2"
                    className={classes.numberOfTrees}
                  >
                    {t("Toolbar.slogan")}
                  </Typography>
                </Hidden>
              </Grid>
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
                  <Button href="/signin">{t("SignIn.buttonConnexion")}</Button>
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
