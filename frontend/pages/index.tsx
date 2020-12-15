import { useState, createRef, useEffect } from "react";
import { Grid, makeStyles, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";
import ETKMap from "../components/Map/Map";
import ETKMapSearchCity from "../components/Map/SearchCity";
import ETKPanel from "../components/Panel";
import ETKLanding from "../components/Landing";
import { useAppContext } from "../providers/AppContext";
import { apiRest } from "../lib/api";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AppLayoutCarto from "@/components/appLayout/Carto";

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
    top: "2rem",
    right: "5rem",
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
  const { dark } = useThemeContext();

  useEffect(() => {
    const mapTheme = `${dark ? "dark" : "light"}`;

    if (user) {
      setLanding(false);
      if (user.currentOrganization) {
        mapRef.current.map.setStyle(
          `/api/v1/maps/style/?theme=${mapTheme}&token=${apiRest.getToken()}&organization_id=${
            user.currentOrganization.id
          }`
        );
      }
    } else {
      mapRef.current.map.setStyle(`/api/v1/maps/style/?theme=${mapTheme}`);
    }
  }, [isLoading, user, mapRef]);

  return (
    <AppLayoutCarto>
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
          <ETKMap ref={mapRef} styleSource="/api/v1/maps/style/" />
          {!landing && (
            <ETKMapSearchCity className={classes.mapSearchCity} map={mapRef} />
          )}
        </Grid>
      </Grid>
    </AppLayoutCarto>
  );
}
