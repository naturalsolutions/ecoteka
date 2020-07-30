import { useState, createRef } from 'react';
import { Toolbar, Drawer, makeStyles } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

import ETKToolbar from '../components/Toolbar';
import ETKSidebar from '../components/Sidebar';
import ETKMap from '../components/Map/Map';
import ETKMapGeolocateFab from '../components/Map/GeolocateFab';
import ETKMapSateliteToggle from '../components/Map/MapSatelliteToggle';
import ETKMapSearchCity from '../components/Map/SearchCity';
import speces from '../public/assets/speces.json';
import layersStyle from '../public/assets/layersStyle.json';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
  },
}));

export default function Index() {
  const mapRef = createRef();
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [currentProperties, setCurrentProperties] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('light');
  const theme = createMuiTheme({
    palette: {
      type: currentTheme,
      primary: {
        main: currentTheme === 'light' ? '#01685a' : '#fff',
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: red.A400,
      },
      background: {
        default: '#fff',
      },
    },
  });

  const onFilterSpecies = (values) => {
    if (!values.length) {
      mapRef.current.map.setFilter('ecoteka-data', null);
      return;
    }

    mapRef.current.map.setFilter('ecoteka-data', [
      'in',
      'genre_latin',
      ...values,
    ]);
  };

  const onMapClick = (map, e) => {
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    var features = map.queryRenderedFeatures(bbox, {
      layers: ['ecoteka-data', 'ecoteka-data-osm'],
    });

    if (features.length) {
      const feature = features.pop();
      let genre = null;

      if (feature.properties.genre_latin) {
        genre = feature.properties.genre_latin.toLowerCase().replace(' ', '_');
      }

      if (feature.properties.genre) {
        genre = feature.properties.genre.toLowerCase().replace(' ', '_');
      }

      if ((genre || feature.properties) && !isDrawerOpen) {
        setIsDrawerOpen(true);
      }

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
    window.dispatchEvent(new Event('resize'));
  };

  const onDarkToggleHandler = (dark) => {
    const mapTheme = dark ? 'light' : 'dark';

    setCurrentTheme(mapTheme);
    toggleMapTheme(mapTheme);
  };

  const onMapSateliteToggleHandler = (active) => {
    mapRef.current.map.setLayoutProperty(
      'satellite',
      'visibility',
      active === 'map' ? 'none' : 'visible'
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
    <ThemeProvider theme={theme}>
      <div className={classes.root} role="presentation">
        <ETKToolbar
          logo={`/assets/${currentTheme}/logo.svg`}
          numberOfTrees="4.6 millions of trees"
          aboutText="About"
          onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)}
          onDarkToggle={onDarkToggleHandler}
        />

        <main className={classes.content}>
          <ETKMap
            ref={mapRef}
            styleSource="/assets/style.json"
            onMapClick={onMapClick}
            onStyleData={onMapLoaded}
          />
          <ETKMapSearchCity onChange={onSearchCityChangeHandler} />
          <ETKMapGeolocateFab map={mapRef} />
          <ETKMapSateliteToggle onToggle={onMapSateliteToggleHandler} />
        </main>
      </div>
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Toolbar variant="dense" />
        <ETKSidebar
          speces={speces}
          activeTab={activeTab}
          currentGenre={currentGenre}
          currentProperties={currentProperties}
          onFilterSpecies={onFilterSpecies}
          onTabChange={setActiveTab}
        />
      </Drawer>
    </ThemeProvider>
  );
}
