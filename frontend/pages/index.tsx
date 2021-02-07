import { useState, createRef, useEffect } from "react";
import { Grid, makeStyles, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";
import Map from "@/components/Map/Map";
import MapSearchCity from "@/components/Map/SearchCity";
import MapGeolocateFab from "@/components/Map/GeolocateFab";
import Panel from "@/components/Panel";
import Landing from "@/components/Landing";
import { useAppContext } from "@/providers/AppContext";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import AppLayoutCarto from "@/components/AppLayout/Carto";
import { TMapToolbarAction } from "@/components/Map/Toolbar";

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
  const mapRef = createRef<Map>();
  const classes = useStyles();
  const { user } = useAppContext();
  const [landing, setLanding] = useState(true);
  const router = useRouter();
  const { dark } = useThemeContext();

  useEffect(() => {
    const mapTheme = `${dark ? "dark" : "light"}`;

    if (user) {
      router.push("/map/");
    } else {
      const map = mapRef.current.map;

      map.setStyle(`/api/v1/maps/style/?theme=${mapTheme}`);
      map.on("click", "osm", (e) => {
        if (e.features.length > 0) {
          map.removeFeatureState({
            source: "osm",
            sourceLayer: "ecoteka-data",
          });
          map.setFeatureState(
            {
              source: "osm",
              sourceLayer: "ecoteka-data",
              id: e.features[0].id,
            },
            {
              click: true,
            }
          );
        }
      });
    }
  }, [user, mapRef]);

  const handleOnMapToolbarChange = (action: TMapToolbarAction) => {
    const map = mapRef.current.map;

    switch (action) {
      case "zoom_in":
        return map.setZoom(map.getZoom() + 1);
      case "zoom_out":
        return map.setZoom(map.getZoom() - 1);
    }
  };

  return !user ? (
    <AppLayoutCarto onMapToolbarChange={handleOnMapToolbarChange}>
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.root}
      >
        <Hidden smDown>
          <Grid item className={classes.sidebar}>
            <Panel
              context={{ map: mapRef }}
              panel={router.query.panel as string}
            />
          </Grid>
        </Hidden>
        <Grid item xs className={classes.main}>
          {!user && landing && <Landing map={mapRef} setLanding={setLanding} />}
          <Map ref={mapRef} styleSource="/api/v1/maps/style/"></Map>
          {!landing && (
            <MapSearchCity map={mapRef} className={classes.mapSearchCity} />
          )}
          <MapGeolocateFab map={mapRef} />
        </Grid>
      </Grid>
    </AppLayoutCarto>
  ) : null;
}
