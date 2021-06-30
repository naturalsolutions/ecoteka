import React from "react";
import { Divider, Grid, makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface IMemberItemHeaderProps {}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    borderTop: "1px solid",
    borderTopColor: theme.palette.divider,
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const MemberItemHeader: React.FC<IMemberItemHeaderProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={8} md={11}>
        <Typography color="textSecondary" variant="caption">
          {t("components.MemberItemHeader.user")}
        </Typography>
      </Grid>
      <Grid item xs={4} md={1}>
        <Typography color="textSecondary" variant="caption">
          {t("components.MemberItemHeader.accessLevel")}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MemberItemHeader;
