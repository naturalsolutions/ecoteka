import { FC } from "react";
import {
  Grid,
  makeStyles,
  Paper,
  Typography,
  Box,
  Theme,
} from "@material-ui/core";
import MapSearchCity from "@/components/Map/SearchCity";
import { Trans, useTranslation } from "react-i18next";

type Coords = [Number, Number];

export interface HomeHeroSearchCityProps {
  coords: Coords;
  onChangeCity?(coords: Coords): void;
}

const useStyles = makeStyles<Theme, HomeHeroSearchCityProps>((theme) => ({
  root: {
    width: "100%",
    padding: 16,
  },
  fouded: {
    display: "block",
  },
  [theme.breakpoints.up("md")]: {
    root: {
      position: "absolute",
      top: 20,
      margin: "0 auto",
      left: 0,
      width: "50%",
      maxWidth: 780,
      right: 0,
      padding: "30px 40px",
    },
    founded: {
      display: (props) => (props.coords ? "none" : "block"),
    },
  },
}));

const HomeHeroSearchCity: FC<HomeHeroSearchCityProps> = ({
  coords,
  onChangeCity,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ coords });

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container direction="column" alignItems="stretch">
        <Grid item className={classes.founded}>
          <Typography
            variant="h3"
            component="h1"
            color="textPrimary"
            align="center"
            className={classes.title}
          >
            <Trans>{t("components.Home.title")}</Trans>
          </Typography>
        </Grid>
        <Grid item className={classes.founded}>
          <Box mt={4} />
        </Grid>
        <Grid item>
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={12}>
              <MapSearchCity onChange={onChangeCity} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomeHeroSearchCity;
