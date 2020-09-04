import { useState, createRef, useEffect } from "react";
import { Toolbar, Drawer, makeStyles, useTheme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useRouter } from 'next/router'

import ETKSidebar from "../components/Sidebar";
import ETKMap from "../components/Map/Map";
import ETKMapGeolocateFab from "../components/Map/GeolocateFab";
import ETKMapSateliteToggle from "../components/Map/MapSatelliteToggle";
import ETKMapSearchCity from "../components/Map/SearchCity";
import speces from "../public/assets/speces.json";
import layersStyle from "../public/assets/layersStyle.json";
import ETKImport from "../components/Import/Index.tsx";

import Template from "../components/Template";

const useStyles = makeStyles((theme) => ({
  main: {
    position: 'relative',
    height: '100%'
  },
  drawerCloseBtn: {
    position: 'absolute',
    top: 96,
    right: 0,
    zIndex: 1,
    color: 'red'
  }
}));

export default function IndexPage({ drawer }) {
  const mapRef = createRef();
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  //const [drawerName, setDrawerName] = useState('');
  const [currentTheme, setCurrentTheme] = useState("light");
  const theme = useTheme();

  const onFilterSpecies = (values) => {
    if (!values.length) {
      mapRef.current.map.setFilter("ecoteka-data", null);
      return;
    }

    mapRef.current.map.setFilter("ecoteka-data", [
      "in",
      "genre_latin",
      ...values,
    ]);
  };

  const onMapClick = (map, e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    router.push({
      pathname: "/",
      query: { drawer: null },
    });

    var features = map.queryRenderedFeatures(bbox, {
      layers: ["ecoteka-data", "ecoteka-data-osm"],
    });

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

      router.push('/');
      setCurrentGenre(genre);
      setCurrentProperties(feature.properties);

      if (feature.properties) {
        setActiveTab(1);
      }
    }
  };

  const toggleMapTheme = (mapTheme) => {
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
    toggleMapTheme(currentTheme);
    window.dispatchEvent(new Event("resize"));
  };

  const onDarkToggleHandler = (dark) => {
    const mapTheme = dark ? "light" : "dark";

    setCurrentTheme(mapTheme);
    toggleMapTheme(mapTheme);
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

  const router = useRouter();

  //TODO ?
  useEffect(() => {
    setIsDrawerOpen(true);
  }, [drawer]);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  /* useEffect(() => {
    const handleRouteChange = (value) => {
      const url = new URL(value, 'http://anybase/');
      setDrawerName(url.searchParams.get('drawer'));
      setIsDrawerOpen(true);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []); */

  const renderImport = (
    <ETKImport
      tooltipcontent={[
        "- Importing data is an action that can take several tens of minutes",
        '- Find the progress of your import in the menu: "History of imports"',
        "- Importer des données est une action qui peut nécessiter plusieurs dizaines de minutes",
        "- Retrouvez l'état d'avancement de votre import dans le menu : \"Historique des imports\"",
      ]}
      extensionsFileAccepted={[".xls", ".xlsx", ".csv", ".geojson", ".zip"]}
      templateTips={["Do not hesitate to download our template in .xls format"]}
      dropzoneText={"Drag 'n' drop some files here\nor click to select files"}
    />
  );

  const renderSidebar = (
    <ETKSidebar
      speces={speces}
      activeTab={activeTab}
      currentGenre={currentGenre}
      currentProperties={currentProperties}
      onFilterSpecies={onFilterSpecies}
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
      <div className={classes.main}>
        <ETKMap
          ref={mapRef}
          styleSource="/assets/style.json"
          onMapClick={onMapClick}
          onStyleData={onMapLoaded}
        />
        <ETKMapSearchCity onChange={onSearchCityChangeHandler} />
        <ETKMapGeolocateFab map={mapRef} />
        <ETKMapSateliteToggle onToggle={onMapSateliteToggleHandler} />
      </div>
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Toolbar variant="dense" />
        <Toolbar variant="dense" />
        <IconButton
          size="small"
          className={classes.drawerCloseBtn}
          onClick={() => {
            setIsDrawerOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
        {switchRenderDrawer(drawer)}
      </Drawer>
    </Template>
  );
}

IndexPage.getInitialProps = ({ query: { drawer } }) => {
  return { drawer };
};
