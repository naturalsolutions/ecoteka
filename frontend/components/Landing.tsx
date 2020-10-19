import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import ETKAboutCard from "./Card/About";
import ETKMapSearchCity from "./Map/SearchCity";

export interface ETKLandingProps {
  setLanding?(boolean): void;
  onSearchCity?(city): void;
}

const defaultProps: ETKLandingProps = {};

const useStyles = makeStyles((theme) => ({
  card: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, .5)",
    backdropFilter: "blur(2px)",
  },
  cardContent: {
    position: "relative",
    height: "100%",
  },
  grid: {
    margin: "0 auto",
    height: "100%",
    maxWidth: "40rem",
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(3),
    right: theme.spacing(3),
  },
  mapSearchCity: {
    width: "500px",
  },
  [theme.breakpoints.down("sm")]: {
    mapSearchCity: {
      width: "300px",
    },
    closeIcon: {
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    card: {
      overflow: "scroll",
    },
    cardContent: {
      height: "unset",
      width: "100%",
      padding: "1rem 0 0 0",
    },
  },
}));

const ETKLanding: React.FC<ETKLandingProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card elevation={0} square className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid
          className={classes.grid}
          container
          justify="center"
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h3" paragraph>
              {t("PanelWelcome.title")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography paragraph>
              <Trans>{t("PanelWelcome.text")}</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <Box m={5}>
              <ETKMapSearchCity
                className={classes.mapSearchCity}
                onChange={(city) => {
                  props.setLanding(false);
                  props.onSearchCity(city);
                }}
              />
            </Box>
          </Grid>
          <Grid item>
            <ETKAboutCard background="#fff" buttonVariant="contained" />
          </Grid>
        </Grid>
        <IconButton
          className={classes.closeIcon}
          onClick={() => props.setLanding(false)}
        >
          <CloseIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

ETKLanding.defaultProps = defaultProps;

export default ETKLanding;
