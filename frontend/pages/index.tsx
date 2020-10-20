import { useState, createRef, useEffect } from "react";
import { Paper, Grid, makeStyles, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";

import ETKSidebar from "../components/Sidebar";
import ETKMap from "../components/Map/Map";
import ETKMapGeolocateFab from "../components/Map/GeolocateFab";
import ETKMapSateliteToggle from "../components/Map/MapSatelliteToggle";
import ETKMapSearchCity from "../components/Map/SearchCity";
import ETKPanel from "../components/Panel";
import ETKLanding from "../components/Landing";

import Template from "../components/Template";
import { useAppContext } from "../providers/AppContext";

import layersStyle from "../public/assets/layersStyle.json";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { appContext, setAppContext, user, loading } = useAppContext();
  const [landing, setLanding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      setLanding(false);
    }
  }, [loading, user]);

  useEffect(() => {
    toggleMapTheme(appContext.theme);
  }, [appContext]);

  const onMapClick = (map, e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    router.push({
      pathname: "/",
      query: { drawer: null },
    });

    var features = map
      .queryRenderedFeatures(bbox)
      .filter((f) => f.layer.type === "circle");

    if (features.length) {
      const feature = features.pop();
      let genre = null;

      if (feature.properties.genre_latin) {
        genre = feature.properties.genre_latin.toLowerCase().replace(" ", "_");
      }

      if (feature.properties.genre) {
        genre = feature.properties.genre.toLowerCase().replace(" ", "_");
      }

      if ((genre || feature.properties) && !isDrawerOpen) {
        setIsDrawerOpen(true);
      }

      router.push("/");
      setCurrentGenre(genre);
      setCurrentProperties(feature.properties);

      if (feature.properties) {
        setActiveTab(1);
      }
    }
  };

  const toggleMapTheme = (mapTheme) => {
    if (!isMapLoaded) {
      return;
    }

    for (let layer of Object.keys(layersStyle)) {
      for (let property of Object.keys(layersStyle[layer][mapTheme])) {
        mapRef.current?.map.setPaintProperty(
          layer,
          property,
          layersStyle[layer][mapTheme][property]
        );
      }
    }
  };

  const onMapLoaded = (map) => {
    window.dispatchEvent(new Event("resize"));
    setIsMapLoaded(true);
    setAppContext({
      theme: "light",
    });
  };

  const onMapSateliteToggleHandler = (active) => {
    mapRef.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      active === "map" ? "none" : "visible"
    );
  };

  const onSearchCityChangeHandler = (city) => {
    if (city.centre && city.centre.coordinates) {
      mapRef.current.map.setZoom(12);
      mapRef.current.map.flyTo({
        center: city.centre.coordinates,
      });
    }
  };

  return (
    <Template>
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.root}
      >
        <Hidden mdDown>
          <Grid item className={classes.sidebar}>
            <ETKPanel
              context={{ map: mapRef }}
              panel={router.query.panel as string}
            />
          </Grid>
        </Hidden>
        <Grid item xs className={classes.main}>
          {landing && (
            <ETKLanding
              setLanding={setLanding}
              onSearchCity={onSearchCityChangeHandler}
            />
          )}
          <ETKMap
            ref={mapRef}
            styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`}
            onMapClick={onMapClick}
            onStyleData={onMapLoaded}
          />
          {!landing && (
            <ETKMapSearchCity
              className={classes.mapSearchCity}
              onChange={onSearchCityChangeHandler}
            />
          )}
          <ETKMapGeolocateFab map={mapRef} />
          <ETKMapSateliteToggle onToggle={onMapSateliteToggleHandler} />
        </Grid>
      </Grid>
    </Template>
  );
}
