import { useState, createRef, useEffect, Component, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { apiRest as api} from "../lib/api";

import ETKMap from "../components/Map/Map";
import ETKMapGeolocateFab from "../components/Map/GeolocateFab";
import ETKMapSateliteToggle from "../components/Map/MapSatelliteToggle";
import ETKMapSearchCity from "../components/Map/SearchCity";
import layersStyle from "../public/assets/layersStyle.json";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ETKAlertController from "../components/AlertController";
import Template from "../components/Template";
import { useAppContext } from "../providers/AppContext";
import TextField from "@material-ui/core/TextField";

import mapboxgl from "mapbox-gl";

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    margin: '0px'
  },
  satToogleWrapper: {
    position: "absolute"
  }
}));

export default function TreeEditionPage({ id }) {
  const mapRef = createRef(),
    alertRef = createRef();
  const classes = useStyles();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { appContext, setAppContext, user } = useAppContext();
  const initialModel = {
    scientific_name: '',
    y: 0,
    x: 0
  };
  const [model, setModel] = useState(initialModel);
  const [marker, setMarker] = useState();
  const [creating, setCreating] = useState(!Boolean(id));

  useEffect(() => {
    const _m = new mapboxgl.Marker({ draggable: true })
      .setLngLat([model.x, model.y])
      .addTo(mapRef.current.map);

    setMarker(_m);
  }, []);

  useEffect(() => {
    onThemeToogle(appContext.theme);
  }, [appContext]);

  useEffect(() => {
    if (!marker) {
      return;
    }
    marker.setLngLat([model.x, model.y]);
  }, [model.x, model.y]);


  const setFormElementValue = (name, value) => {
    setModel({ ...model, [name]: value });
  }
  const setModelLngLat = (x, y) => {
    setModel({ ...model, x, y });
  }

  const postTree = async (model) => {
    if (!creating) { return; }
    try {
      const response = await api.trees.post(model);
      id = response.id;

      alertRef.current.create({
        title: 'Success',
        message: `Votre arbre a été enregistré. Voulez-vous en enregistrer un autre ?`,
        actions: [
          { label: 'oui', value: true },
          { label: 'non', value: false }
        ],
        onDismiss: (v) => {
          if (v) {
            setModel(initialModel);
            setCreating(true);
          } else {
            setCreating(false);
          }
        }
      });

    } catch (e) {
      alertRef.current.create({
        title: 'Erreur',
        message: `Une erreur est survenue lors de l'enregistrement de l'arbre\n${e}`,
        actions: [
          { label: 'ok', value: true },
        ]
      });
    }
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (creating) {
      await postTree(model);
    }
  }


  const onThemeToogle = (theme) => {
    if (!isMapLoaded) {
      return;
    }

    for (let layer of Object.keys(layersStyle)) {
      for (let property of Object.keys(layersStyle[layer][theme])) {
        mapRef.current.map.setPaintProperty(
          layer,
          property,
          layersStyle[layer][theme][property]
        );
      }
    }
  };

  const onMapClick = (map, e) => {
    const lngLat = e.lngLat;
    setModelLngLat(lngLat.lng, lngLat.lat);
  };
  const onMapLoaded = (map) => {
    window.dispatchEvent(new Event("resize"));
    setIsMapLoaded(true);
    setAppContext({
      theme: "light",
    });
  };
  const onMapSateliteToggle = (active) => {
    mapRef.current.map.setLayoutProperty(
      "satellite",
      "visibility",
      active === "map" ? "none" : "visible"
    );
  };
  const onMapCitySearch = (city) => {
    if (city.centre && city.centre.coordinates) {
      mapRef.current.map.setZoom(12);
      mapRef.current.map.flyTo({
        center: city.centre.coordinates,
      });
    }
  };
  const onGeolocate = (e) => {
    const coords = e.coords;
    setModelLngLat(coords.latitude, coords.longitude);
  };
  // Silly pattern to solve a silly problem !!!!
  const onMarkerDragEnd = useCallback((e) => {
    const lngLat = e.target.getLngLat();
    setModelLngLat(lngLat.lng, lngLat.lat);
  }, [model]);
  useEffect(() => {
    if (!marker)
      return;

    marker.on('dragend', onMarkerDragEnd);
    return () => marker.off('dragend', onMarkerDragEnd);
  }, [onMarkerDragEnd]);

  return (
    <Template>
      <Grid container spacing={1} xs={12} className={classes.root}>
        <Grid item xs={4} spacing={1}>
          <h2>Ajouter un arbre</h2>
          <form noValidate autoComplete="off" onSubmit={onFormSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  name="scientific_name"
                  value={model.scientific_name}
                  variant="filled"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  label="Nom scientifique"
                  fullWidth
                  onChange={(e) => setFormElementValue('scientific_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="y"
                  value={model.y}
                  type="number"
                  required
                  variant="filled"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  label="Latitude"
                  fullWidth
                  onChange={(e) => setFormElementValue('y', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="x"
                  value={model.x}
                  type="number"
                  required
                  variant="filled"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  label="Longitude"
                  fullWidth
                  onChange={(e) => setFormElementValue('x', e.target.value)}
                />
              </Grid>
              <Grid item justify="flex-end" alignItems="flex-start">
                <Button type="submit" variant="contained">{creating ? 'enregistrer' : 'modifier'}</Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={8}>
          <ETKMap
            ref={mapRef}
            styleSource="/assets/style.json"
            onMapClick={onMapClick}
            onStyleData={onMapLoaded}
            onGeolocate={onGeolocate}
          />
          <ETKMapSearchCity onChange={onMapCitySearch} />
          <ETKMapGeolocateFab map={mapRef} />
          <div className={classes.satToogleWrapper}>
            <ETKMapSateliteToggle onToggle={onMapSateliteToggle} />
          </div>
        </Grid>
      </Grid>
      <ETKAlertController ref={alertRef} />
    </Template>
  );
}

TreeEditionPage.getInitialProps = ({ query: { id } }) => {
  return { id };
};
