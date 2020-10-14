import React from "react";
import {
  makeStyles,
  Paper,
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
  root: {
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
  box: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  content: {
    margin: "0 auto",
    height: "100%",
    maxWidth: "40rem",
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(3),
    right: theme.spacing(3),
  },
}));

const mapSearchCityStyle = {
  width: "300px",
};

const ETKLanding: React.FC<ETKLandingProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  return (
    <Paper elevation={0} square className={classes.root}>
      <Box className={classes.box}>
        <Grid
          className={classes.content}
          container
          justify="center"
          direction="column"
          alignItems="center"
        >
          <Grid item>
            <Box mb={3} p={2}>
              <Typography variant="h3">{t("PanelWelcome.title")}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box mb={3} p={2}>
              <Typography paragraph>
                <Trans>{t("PanelWelcome.text")}</Trans>
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box m={5}>
              <ETKMapSearchCity
                style={mapSearchCityStyle}
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
      </Box>
    </Paper>
  );
};

ETKLanding.defaultProps = defaultProps;

export default ETKLanding;
