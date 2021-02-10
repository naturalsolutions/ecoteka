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
import DeckGL from "@deck.gl/react";
import { FlyToInterpolator } from "@deck.gl/core";
import { MVTLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import getConfig from "next/config";

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
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const mapRef = createRef<Map>();
  const classes = useStyles();
  const { user } = useAppContext();
  const [landing, setLanding] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: 2.54,
    latitude: 46.7,
    zoom: 5,
  });

  const router = useRouter();
  const { dark } = useThemeContext();

  const osmLayer = new MVTLayer({
    id: "osm",
    data: `${apiUrl.replace(
      "/api/v1",
      ""
    )}/tiles/osm/{z}/{x}/{y}.pbf?scope=public`,
    minZoom: 0,
    maxZoom: 13,
    getRadius: 1,
    radiusScale: 10,
    radiusMinPixels: 0.25,
    lineWidthMinPixels: 1,
    pointRadiusMinPixels: 1,
    pointRadiusMaxPixels: 10,
    pointRadiusScale: 2,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    pickable: true,
  });

  useEffect(() => {
    if (user) {
      router.push("/map/");
    }
  }, [user]);

  const handleCityChange = (coordinates) => {
    if (coordinates) {
      setViewState({
        ...viewState,
        longitude: coordinates[0],
        latitude: coordinates[1],
        zoom: 15,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }

    setLanding(false);
  };

  return !user ? (
    <AppLayoutCarto>
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.root}
      >
        <Hidden smDown>
          <Grid item className={classes.sidebar}>
            <Panel panel={router.query.panel as string} />
          </Grid>
        </Hidden>
        <Grid item xs className={classes.main}>
          {!user && landing && <Landing onChange={handleCityChange} />}
          <DeckGL
            viewState={viewState}
            controller={true}
            layers={[osmLayer]}
            onViewStateChange={(e) => {
              setViewState(e.viewState);
            }}
            onClick={(info) => {}}
          >
            <StaticMap
              mapStyle={`/api/v1/maps/style/?theme=${dark ? "dark" : "light"}`}
            />
            {navigator?.geolocation && (
              <MapGeolocateFab
                onGeolocate={() => {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setViewState({
                      ...viewState,
                      longitude: position.coords.longitude,
                      latitude: position.coords.latitude,
                      zoom: 18,
                      transitionDuration: 1500,
                      transitionInterpolator: new FlyToInterpolator(),
                    });
                  });
                }}
              />
            )}
          </DeckGL>
          {!landing && (
            <MapSearchCity
              className={classes.mapSearchCity}
              onChange={handleCityChange}
            />
          )}
        </Grid>
      </Grid>
    </AppLayoutCarto>
  ) : null;
}
