import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

export interface ETKCardAboutProps {}

const defaultProps: ETKCardAboutProps = {};

const useStyles = makeStyles(() => ({
  root: {
    background: "#b2dfdc",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
}));

const ETKCardAbout: React.FC<ETKCardAboutProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Typography className={classes.title} align="center" variant="h6">
              {t("CardAbout.title")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography align="center" paragraph={true}>
              {t("CardAbout.content")}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary">
              {t("CardAbout.button")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ETKCardAbout.defaultProps = defaultProps;

export default ETKCardAbout;
