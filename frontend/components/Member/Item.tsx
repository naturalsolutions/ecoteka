import { IMember } from "@/index";
import { Avatar, Grid, Box, Typography, makeStyles } from "@material-ui/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export interface MemberItemProps {
  member: IMember;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  },
  avatar: {
    width: 28,
    height: 28,
    margin: theme.spacing(1),
  },
}));

const MemberItem: FC<MemberItemProps> = ({ member }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item className={classes.root}>
      <Grid container>
        <Grid item xs={8} md={11}>
          <Grid container alignItems="center">
            <Grid item>
              <Avatar className={classes.avatar}>{member.full_name[0]}</Avatar>
            </Grid>
            <Grid item xs>
              <Grid container direction="column">
                <Typography color="textPrimary" variant="body2">
                  {member.full_name}
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  {member.email}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} md={1}>
          <Typography variant="body2" color="textSecondary">
            {
              t("components.Organization.Members.Table.roles", {
                returnObjects: true,
              })[member.role]
            }
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MemberItem;
