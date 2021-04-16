import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import ContactButton from "@/components/Contact/Button";
import Hidden from "@material-ui/core/Hidden";

export interface ETKCardAboutProps {
  background?: string;
  buttonVariant?: "text" | "outlined" | "contained";
}

const defaultProps: ETKCardAboutProps = {
  background: "#b2dfdc",
  buttonVariant: "outlined",
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  contactButton: {
    opacity: 0.8,
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const ETKCardAbout: React.FC<ETKCardAboutProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card className={classes.card}>
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
            <Typography align="center" paragraph={true} color="textPrimary">
              {t("CardAbout.content")}
            </Typography>
          </Grid>
          <Grid item>
            <Hidden mdDown>
              <ContactButton
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
