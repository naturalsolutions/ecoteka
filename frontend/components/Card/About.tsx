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
import ETKContactButton from "../Contact/Button";
import Hidden from "@material-ui/core/Hidden";

export interface ETKCardAboutProps {
  background?: string;
  buttonVariant?: "text" | "outlined" | "contained";
}

const defaultProps: ETKCardAboutProps = {
  background: "#b2dfdc",
  buttonVariant: "outlined",
};

const ETKCardAbout: React.FC<ETKCardAboutProps> = (props) => {
  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    contactButton: {
      opacity: 0.8,
    },
  }));
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card>
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
            <Hidden mdDown>
              <ETKContactButton
                className={classes.contactButton}
                variant={props.buttonVariant}
                color="primary"
              />
            </Hidden>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ETKCardAbout.defaultProps = defaultProps;

export default ETKCardAbout;
