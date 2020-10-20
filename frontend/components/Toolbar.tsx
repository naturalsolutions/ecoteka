import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MoodIcon from "@material-ui/icons/Mood";
import ETKDarkToggle, { ETKDarkToggleProps } from "./DarkToggle";
import ETKContactButton from "./Contact/Button";
import ETKSigninButton from "./SignIn/Button";
import ETKRegisterButton from "./Register/Button";
import ETKLogout from "./Logout";
import ETKLanguageSelector from "./LanguageSelector";
import { useAppContext } from "../providers/AppContext";
import ETKProfileButton from "./Settings/Profile/Button";

export interface ETKToolbarProps {
  logo: string;
  registerText: string;
  onDarkToggle: ETKDarkToggleProps["onToggle"];
}

const defaultProps: ETKToolbarProps = {
  logo: "/assets/light/logo.svg",
  registerText: "S'inscrire",
  onDarkToggle: () => {},
};

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "35px",
    paddingTop: ".3rem",
  },
  languageSelector: {
    marginRight: "3rem",
  },
  toolbar: {
    background: "#b2dfdc",
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
  const { user } = useAppContext();

  const [userInfosAnchorEl, setUserInfosAnchorEl] = React.useState(null);
  const isUserInfosOpen = Boolean(userInfosAnchorEl);

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
        {user.full_name && <p>{user.full_name}</p>}
        <p>{user.email}</p>
        <ETKProfileButton/>
        <div>
          <ETKLogout
            onClick={() => {
              setUserInfosAnchorEl(null);
            }}
          />
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
        {/* TODO apply theme on backgroundColor */}
        <Divider
          orientation="vertical"
          flexItem
          style={{
            backgroundColor: "#FFF",
          }}
        />
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
      <Toolbar variant="dense" className={classes.toolbar}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <img src={props.logo} className={classes.logo} />
              </Grid>
              <Grid item>
                <Hidden mdDown>
                  <Typography component="h2" className={classes.numberOfTrees}>
                    {t("Toolbar.slogan")}
                  </Typography>
                </Hidden>
              </Grid>
              <Grid item style={{ marginLeft: "1rem" }}>
                <Hidden mdDown>
                  <ETKDarkToggle onToggle={props.onDarkToggle} />
                </Hidden>
              </Grid>
            </Grid>
          </Grid>
          <Hidden mdDown>
            <Grid item xs={12} md={6}>
              <Grid container justify="flex-end">
                <Grid item className={classes.languageSelector}>
                  <ETKLanguageSelector />
                </Grid>

                <ETKContactButton />
                {user?.is_superuser && <ETKRegisterButton />}
                {user && renderWhenSession()}
                {!user && <ETKSigninButton />}
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
