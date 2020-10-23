import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useTranslation } from "react-i18next";
import useETKForm from "../Form/useForm";
import { ETKPanelProps } from "../Panel";
import useETKTreeSchema from "./Schema";
import { apiRest } from "../../lib/api";
import { features } from "process";

const useStyles = makeStyles((theme) => ({
  grid: {
    maxWidth: "25rem",
  },
  title: {
    fontWeight: "bold",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bold",
  },
}));

const ETKTreeForm: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const schema = useETKTreeSchema();
  const { fields, handleSubmit, setValue, getValues } = useETKForm({
    schema: schema,
  });
  const [mode, setMode] = useState("edit");
  const [features, setFeatures] = useState([]);

  const onSubmit = async (data) => {
    console.log(data);
  };

  const setLngLat = ([lng, lat]) => {
    setValue("x", lng);
    setValue("y", lat);
  };

  const onClick = async (e) => {
    setLngLat([e.lngLat.lng, e.lngLat.lat]);

    await handleSubmit(async (data) => {
      const response = await apiRest.trees.post(data);
      const newFeature = {
        id: response.id,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        },
        properties: getValues(),
      };

      setFeatures((features) => [...features, newFeature]);
    })();
  };

  const onEdit = (e) => {
    const features = props.context.map.current.map.queryRenderedFeatures(
      e.point,
      {
        layers: ["newTrees", "ecoteka-ecoteka"],
      }
    );

    if (!features.length) {
      return;
    }

    let active = true;

    if (features[0].state.active) {
      active = !features[0].state.active;
    }

    props.context.map.current.map.setFeatureState(
      {
        source: features[0].source,
        sourceLayer: features[0].sourceLayer,
        id: features[0].id,
      },
      {
        active: active,
      }
    );
  };

  const onDelete = async () => {
    const featuresRendered = props.context.map.current.map.queryRenderedFeatures(
      {
        layers: ["newTrees", "ecoteka-ecoteka"],
      }
    );

    console.log(featuresRendered);

    const featuresToDelete = featuresRendered
      .filter((f) => f.state.active)
      .map((f) => f.properties.id);

    for (let i = 0; i < featuresToDelete.length; i++) {
      await apiRest.trees.delete(featuresToDelete[i]);
    }

    props.context.map.current.map.setFilter("ecoteka-ecoteka", [
      "in",
      "properties.id",
      ["literal", featuresToDelete],
    ]);
  };

  const onGeolocate = (e) => {
    setLngLat([e.coords.longitude, e.coords.latitude]);
  };

  useEffect(() => {
    if (features.length) {
      props.context.map.current.map.getSource("newTrees").setData({
        type: "FeatureCollection",
        features: features,
      });
    }
  }, [features]);

  useEffect(() => {
    switch (mode) {
      case "new":
        props.context.map.current.map.getCanvas().style.cursor = "crosshair";
        props.context?.map?.current?.map.on("click", onClick);
        break;
      default:
        props.context.map.current.map.getCanvas().style.cursor = "";
        props.context?.map?.current?.map.on("click", onEdit);
        break;
    }

    return () => {
      switch (mode) {
        case "new":
          props.context?.map?.current?.map.off("click", onClick);
          break;
        default:
          props.context?.map?.current?.map.off("click", onEdit);
          break;
      }
    };
  }, [mode]);

  useEffect(() => {
    props.context?.map?.current?.map.on("load", () => {
      props.context?.map?.current?.map.geolocate.on("geolocate", onGeolocate);
      props.context?.map?.current?.map.addLayer({
        id: "newTrees",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        },
        paint: {
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-radius": {
            base: 1.75,
            stops: [
              [12, 2],
              [22, 180],
            ],
          },
          "circle-color": [
            "case",
            ["==", ["feature-state", "active"], true],
            "red",
            "#2597e4",
          ],
        },
      });
    });

    return () => {
      props.context?.map?.current?.map.geolocate.off("geolocate", onGeolocate);
    };
  }, []);

  return (
    <Grid container direction="column" spacing={2} className={classes.grid}>
      <Grid item>
        <Grid container>
          <Grid item xs>
            <Typography variant="h6" className={classes.title}>
              Ajouter un arbre
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setMode("new")}
            >
              New
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setMode("edit")}
            >
              Edit
            </Button>
            <Button variant="outlined" size="small" onClick={() => onDelete()}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {fields.vernacularName}
          </Grid>
          <Grid item xs={6}>
            {fields.y}
          </Grid>
          <Grid item xs={6}>
            {fields.x}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Identité de l'arbre
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              {Object.keys(schema)
                .filter(
                  (f) =>
                    schema[f].category === "Identité de l'arbre" &&
                    !["x", "y", "vernacularName"].includes(f)
                )
                .map((f) => (
                  <Grid key={`${schema[f].category}-${f}`} item>
                    {fields[f]}
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Caractéristiques
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              {Object.keys(schema)
                .filter((f) => schema[f].category === "Caractéristiques")
                .map((f) => (
                  <Grid key={`${schema[f].category}-${f}`} item>
                    {fields[f]}
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Environnement extérieur
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              {Object.keys(schema)
                .filter((f) => schema[f].category === "Environnement extérieur")
                .map((f) => (
                  <Grid key={`${schema[f].category}-${f}`} item>
                    {fields[f]}
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Autre</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              {Object.keys(schema)
                .filter((f) => schema[f].category === "Autre")
                .map((f) => (
                  <Grid key={`${schema[f].category}-${f}`} item>
                    {fields[f]}
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item>
        <Grid container justify="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ETKTreeForm;
