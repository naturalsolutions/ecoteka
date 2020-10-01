import PropTypes from "prop-types";
import { useState, createRef, useEffect } from "react";
import { Paper, Grid, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

import ETKSidebar from "../components/Sidebar";
import ETKMap from "../components/Map/Map";
import ETKMapGeolocateFab from "../components/Map/GeolocateFab";
import ETKMapSateliteToggle from "../components/Map/MapSatelliteToggle";
import ETKMapSearchCity from "../components/Map/SearchCity";
import ETKImport from "../components/Import/Index";

import Template from "../components/Template";
import { useAppContext } from "../providers/AppContext";

import layersStyle from "../public/assets/layersStyle.json";
import { apiRest } from "../lib/api";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    height: "100%",
  },
  sidebar: {
    height: "100%",
    overflowY: "scroll",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  },
  sidebarPaper: {
    height: "100%",
  },
  main: {
    position: "relative",
  },
}));

export default function IndexPage({ drawer }) {
  const mapRef = createRef();
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { appContext, setAppContext, user } = useAppContext();
  const router = useRouter();

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
        mapRef.current.map.setPaintProperty(
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

  const renderImport = (
    <ETKImport
      map={mapRef}
      tooltipcontent={[
        "- Importer des données est une action qui peut nécessiter plusieurs dizaines de minutes",
        "- Retrouvez l'état d'avancement de votre import dans le menu : \"Historique des imports\"",
      ]}
      extensionsFileAccepted={[".xls", ".xlsx", ".csv", ".geojson", ".zip"]}
      templateTips={[
        "N'hésitez pas à télécharger notre template au formal .xls",
      ]}
      dropzoneText={
        "Déposez votre fichier ici\nou cliquez pour le selectionner"
      }
    />
  );

  const renderSidebar = (
    <ETKSidebar
      activeTab={activeTab}
      currentGenre={currentGenre}
      currentProperties={currentProperties}
      onTabChange={setActiveTab}
    />
  );

  const switchRenderDrawer = (panel) => {
    switch (panel) {
      case "import":
        return renderImport;
      default:
        return renderSidebar;
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
        <Grid item className={classes.sidebar}>
          <Paper elevation={0} className={classes.sidebarPaper}>
            {switchRenderDrawer(drawer)}
          </Paper>
        </Grid>
        <Grid item xs className={classes.main}>
          <ETKMap
            ref={mapRef}
            styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`}
            onMapClick={onMapClick}
            onStyleData={onMapLoaded}
          />
          <ETKMapSearchCity onChange={onSearchCityChangeHandler} />
          <ETKMapGeolocateFab map={mapRef} />
          <ETKMapSateliteToggle onToggle={onMapSateliteToggleHandler} />
        </Grid>
      </Grid>
    </Template>
  );
}

IndexPage.getInitialProps = ({ query: { drawer } }) => {
  return { drawer };
};
