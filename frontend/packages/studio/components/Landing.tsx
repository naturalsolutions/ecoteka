import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import AboutCard from "@/components/Card/About";
import MapSearchCity from "@/components/Map/SearchCity";

export interface LandingProps {
  onChange?(item?: {}): void;
}

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
  searchBox: {
    margin: "2rem 0",
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
    },
  },
}));

const Landing: React.FC<LandingProps> = ({ onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Card elevation={0} square className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid
          className={classes.grid}
          container
          justifyContent="center"
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h3" paragraph>
              {t("components.PanelWelcome.title")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              <Trans>{t("components.PanelWelcome.text")}</Trans>
            </Typography>
          </Grid>
          <Grid item className={classes.searchBox}>
            <MapSearchCity
              className={classes.mapSearchCity}
              onChange={onChange}
            />
          </Grid>
          <Grid item>
            <AboutCard background="#fff" buttonVariant="contained" />
          </Grid>
        </Grid>
        <IconButton className={classes.closeIcon} onClick={() => onChange()}>
          <CloseIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default Landing;
