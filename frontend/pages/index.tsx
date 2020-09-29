import { useState, createRef, useEffect } from "react";
import { Paper, Grid, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

import {
  ETKSidebarAddTree,
  ETKSidebar,
  ETKMapGeolocateFab,
  ETKMapSatelliteToggle,
  ETKMapSearchCity,
  ETKSidebarImport,
  ETKTemplate,
} from "@/ETKC";

import ETKMap from "../components/Map/Map";

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

export default function IndexPage() {
  const mapRef = createRef();
  const classes = useStyles();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { appContext, setAppContext, user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    toggleMapTheme(appContext.theme);
  }, [appContext]);

  const onMapClick = (panel, map, e) => {
    switch (panel) {
      case "add-tree":
        onAddTree(map, e);
        break;
      case "import":
        break;
      default:
        onGetInfoClick(map, e);
        break;
    }
  };

  const onAddTree = (map, e) => {
    alert("aaa");
  };

  const onGetInfoClick = (map, e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    router.push({
      pathname: "/",
    });

    var features = map
      .queryRenderedFeatures(bbox)
      .filter((f) => f.layer.type === "circle");
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

  const onMapSatelliteToggleHandler = (active) => {
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
    <ETKSidebarImport
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

  const renderSidebar = <ETKSidebar />;

  const renderAddTree = (
    <ETKSidebarAddTree
      map={mapRef.current}
      titleText="Ajouter un arble"
      addText="Ajouter"
      scientificNameText="Nom scientifique"
      latitudeText="Latitude"
      longitudeText="Longitude"
    />
  );

  const switchRenderDrawer = (panel) => {
    switch (panel) {
      case "import":
        return renderImport;
      case "add-tree":
        return renderAddTree;
      default:
        return renderSidebar;
    }
  };

  return (
    <ETKTemplate>
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.root}
      >
        <Grid item className={classes.sidebar}>
          <Paper square elevation={0} className={classes.sidebarPaper}>
            {switchRenderDrawer(router.query?.panel)}
          </Paper>
        </Grid>
        <Grid item xs className={classes.main}>
          <ETKMap
            ref={mapRef}
            styleSource={`/api/v1/maps/style?token=${apiRest.getToken()}`}
            onMapClick={(map, event) =>
              onMapClick(router.query?.panel, map, event)
            }
            onStyleData={onMapLoaded}
          />
          <ETKMapSearchCity onChange={onSearchCityChangeHandler} />
          <ETKMapGeolocateFab map={mapRef} />
          <ETKMapSatelliteToggle onToggle={onMapSatelliteToggleHandler} />
        </Grid>
      </Grid>
    </ETKTemplate>
  );
}
