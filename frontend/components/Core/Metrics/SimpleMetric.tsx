import { FC, ReactElement } from "react";
import { makeStyles, Theme, Grid, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface SimpleMetricProps {
  metric: number | string;
  caption: string;
  icon?: ReactElement;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(3),
  },
  icon: {
    paddingBottom: theme.spacing(1),
  },
  metric: {},
  caption: {
    paddingBottom: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const SimpleMetric: FC<SimpleMetricProps> = ({ metric, caption, icon }) => {
  const classes = useStyles();
  const { t } = useTranslation(["common"]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      {icon && (
        <Grid item className={classes.icon}>
          {icon}
        </Grid>
      )}
      <Grid item className={classes.metric}>
        <Typography variant="h3" component="div">
          {metric == 0 ? t("common.nonAvailableAbbr") : metric}
        </Typography>
      </Grid>
      <Grid item className={classes.caption}>
        {caption}
      </Grid>
    </Grid>
  );
};

export default SimpleMetric;
