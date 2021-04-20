import { FC } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Grid,
  Typography,
  fade,
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";
import MapProvider from "@/components/Map/Provider";
import OSMLayer from "@/components/Map/Layers/OSM";
import SearchIcon from "@material-ui/icons/Search";

export interface HomeHeroProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
    height: "calc(100vh - 200px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  paper: {
    position: "absolute",
    top: 20,
    padding: "20px",
    width: "90%",
    [theme.breakpoints.up("md")]: {
      width: "auto",
      padding: "40px 80px",
    },
  },
}));

const HomeHero: FC<HomeHeroProps> = ({}) => {
  const classes = useStyles();
  const osmLayer = OSMLayer(true);
  const { t } = useTranslation(["common", "components"]);

  return (
    <div className={classes.root}>
      <MapProvider
        PaperProps={{ elevation: 0, className: classes.map }}
        layers={[osmLayer]}
        height={"100%"}
      />
      <Paper className={classes.paper}>
        <Grid container direction="column" alignItems="stretch">
          <Grid item>
            <Typography
              variant="h3"
              component="h1"
              color="textPrimary"
              align="center"
            >
              <Trans>{t("components.Home.title")}</Trans>
            </Typography>
          </Grid>
          <Grid item>
            <Box mt={4} />
          </Grid>
          <Grid item>
            <Grid container spacing={1} justify="center" alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Explorer les arbres d’une ville ..."
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button color="primary" variant="contained" fullWidth>
                  {t("common.buttons.search")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default HomeHero;
