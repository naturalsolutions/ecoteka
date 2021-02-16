import React from "react";
import {
  Grid,
  Popover,
  Avatar,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Logout from "@/components/Logout";
import { useAppContext } from "@/providers/AppContext";
import { IUser } from "@/index";
import { useRouter } from "next/router";

export interface UserMainMenuButtonProps {}

const defaultProps: UserMainMenuButtonProps = {};

const getDisplayNameFromUser = (user: IUser) => {
  return user.full_name || user.email.substr(0, user.email.indexOf("@"));
};

const useStyles = makeStyles({
  button: {
    justifyContent: "right",
    textTransform: "inherit",
  },
});

const UserMainMenuButton: React.FC<UserMainMenuButtonProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useAppContext();
  const { t } = useTranslation("components");
  const router = useRouter();
  const classes = useStyles();

  const handlerMyOrganizationClick = () => {
    setAnchorEl(null);
    router.push(`/organization/${user.currentOrganization?.id}`);
  };

  const handlerMyDashboardClick = () => {
    setAnchorEl(null);
    router.push(`/dashboard`);
  };

  const handlerLogoutClick = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <Avatar style={{ height: 35, width: 35 }}>
          {user.full_name
            .split(" ")
            .slice(0, 2)
            .map((s) => s[0].toUpperCase())}
        </Avatar>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
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
        <Card>
          <CardContent>
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
                  <Grid item>
                    <Grid
                      container
                      direction="column"
                      justify="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item xs>
                        {getDisplayNameFromUser(user)}
                      </Grid>
                      <Grid item xs>
                        {user.email}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box mt={2} mb={1}>
                <Divider />
              </Box>
              <Grid item>
                <Button
                  className={classes.button}
                  fullWidth
                  size="small"
                  onClick={handlerMyOrganizationClick}
                >
                  {t("components.Toolbar.myOrganizations")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  className={classes.button}
                  fullWidth
                  onClick={handlerMyDashboardClick}
                >
                  {t("components.Toolbar.myDashboard")}
                </Button>
              </Grid>
              <Box mt={2} mb={1}>
                <Divider />
              </Box>
              <Grid item>
                <Logout
                  buttonProps={{
                    fullWidth: true,
                    size: "small",
                    className: classes.button,
                  }}
                  onClick={handlerLogoutClick}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
};

UserMainMenuButton.defaultProps = defaultProps;

export default UserMainMenuButton;
