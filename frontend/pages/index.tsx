import { useState, createRef, useEffect } from "react";
import { Grid, makeStyles, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";
import ETKMap from "../components/Map/Map";
import ETKMapGeolocateFab from "../components/Map/GeolocateFab";
import ETKMapSearchCity from "../components/Map/SearchCity";
import ETKPanel from "../components/Panel";
import ETKLanding from "../components/Landing";
import { useAppContext } from "../providers/AppContext";
import { apiRest } from "../lib/api";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
  sidebar: {
    height: "100%",
  },
  main: {
    position: "relative",
  },
  mapSearchCity: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    width: "300px",
  },
  [theme.breakpoints.down("sm")]: {
    mapSearchCity: {
      width: "92vw",
    },
  },
}));

export default function IndexPage() {
  const mapRef = createRef<ETKMap>();
  const classes = useStyles();
  const { user, isLoading } = useAppContext();
  const [landing, setLanding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLanding(false);
    }
  }, [isLoading, user]);

  return (
    <Grid
      container
      justify="flex-start"
      alignItems="stretch"
      className={classes.root}
    >
      <Hidden smDown>
        <Grid item className={classes.sidebar}>
          <ETKPanel
            context={{ map: mapRef }}
            panel={router.query.panel as string}
          />
        </Grid>
      </Hidden>
      <Grid item xs className={classes.main}>
        {!user && landing && (
          <ETKLanding map={mapRef} setLanding={setLanding} />
        )}
        <ETKMap
          ref={mapRef}
          styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`}
        />
        {!landing && (
          <ETKMapSearchCity className={classes.mapSearchCity} map={mapRef} />
        )}
        <ETKMapGeolocateFab map={mapRef} />
      </Grid>
    </Grid>
  );
}
