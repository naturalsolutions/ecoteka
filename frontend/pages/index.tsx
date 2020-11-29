import { useState, createRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Grid, makeStyles, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";
import ETKMap from "@/components/Map/Map";
import ETKMapGeolocateFab from "@/components/Map/GeolocateFab";
import ETKMapSearchCity from "@/components/Map/SearchCity";
import ETKPanel from "@/components/Panel";
import ETKLanding from "@/components/Landing";
import { useAppContext } from "@/providers/AppContext";
import { apiRest } from "@/lib/api";

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
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    if (user) {
      setLanding(false);
      if (user.currentOrganization) {
        mapRef.current.map.setStyle(
          `/api/v1/maps/style?token=${apiRest.getToken()}&organization_id=${
            user.currentOrganization.id
          }`
        );
      }
    } else {
      mapRef.current.map.setStyle("/api/v1/maps/style");
    }
  }, [isLoading, user, mapRef]);

  useEffect(() => {
    if (user?.currentOrganization && router.query?.tree) {
      apiRest.trees
        .get(user.currentOrganization.id, router.query.tree)
        .then((response) => {
          mapRef.current.map.flyTo({
            zoom: 18,
            center: [response.x, response.y],
            essential: true,
          });
          const marker = new mapboxgl.Marker()
            .setLngLat([response.x, response.y])
            .addTo(mapRef.current.map);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [router, user, mapRef]);

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
        <ETKMap ref={mapRef} styleSource="/api/v1/maps/style" />
        {!landing && (
          <ETKMapSearchCity className={classes.mapSearchCity} map={mapRef} />
        )}
        <ETKMapGeolocateFab map={mapRef} />
      </Grid>
    </Grid>
  );
}
