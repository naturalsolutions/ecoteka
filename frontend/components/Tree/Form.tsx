import React, { useEffect, useState } from "react";
import getConfig from "next/config";
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
import { useTemplate } from "../Template";

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

const useStyles = makeStyles((theme) => ({
  grid: {
    width: "25rem",
  },
  title: {
    fontWeight: "bold",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bold",
  },
}));

const EXCLUDE_MULTIPLE_SELECTION_FIELDS = [
  "etkRegistrationNumber",
  "registrationNumber",
];

const ETKTreeForm: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { dialog } = useTemplate();
  const { t } = useTranslation("components");
  const [currentAction, setCurrentAction] = useState("selection");
  const [features, setFeatures] = useState([]);
  const [selection, setSelection] = useState([]);
  const schema = useETKTreeSchema({
    exclude: selection.length <= 1 ? [] : EXCLUDE_MULTIPLE_SELECTION_FIELDS,
  });
  const { fields, handleSubmit, setValue, getValues, reset } = useETKForm({
    schema: schema,
  });

  const onSubmit = async (data) => {
    await apiRest.trees.patch(selection[0], data);
  };

  const editValues = (values) => {
    Object.keys(values).map((v) => setValue(v, values[v]));
  };

  const onNew = async (e) => {
    editValues({
      x: e.lngLat.lng,
      y: e.lngLat.lat,
    });

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

  const onSelection = (e) => {
    const featuresRendered = props.context.map.current.map.queryRenderedFeatures(
      e.point,
      {
        layers: ["newTrees"],
      }
    );

    if (!featuresRendered.length) {
      return;
    }

    let active = true;
    const feature = featuresRendered[0];

    if (feature.state.active) {
      active = !feature.state.active;
    }

    props.context.map.current.map.setFeatureState(
      {
        source: feature.source,
        sourceLayer: feature.sourceLayer,
        id: feature.id,
      },
      {
        active: active,
      }
    );

    const allFeaturesRendered = props.context.map.current.map.queryRenderedFeatures(
      {
        layers: ["newTrees"],
      }
    );

    setSelection(
      allFeaturesRendered
        .filter((f) => f.state.active)
        .map((f) => f.properties.id)
    );
  };

  const ACTIONS = {
    new: {
      cursor: "crosshair",
      event: onNew,
    },
    selection: {
      cursor: "",
      event: onSelection,
    },
  };

  const onDelete = async () => {
    if (selection.length > 0) {
      dialog.current.open({
        title: t("TreeForm.dialogDeleteTitle"),
        content: t("TreeForm.dialogDeleteContent"),
        actions: [
          {
            label: t("TreeForm.dialogDeleteActionYes"),
            variant: "outlined",
            onClick: async () => {
              setFeatures(
                features.filter((f) => !selection.includes(f.properties.id))
              );

              for (const id of selection) {
                await apiRest.trees.delete(id);
              }

              setSelection([]);
              reset();
            },
          },
          {
            label: t("TreeForm.dialogDeleteActionCancel"),
            color: "primary",
            variant: "contained",
          },
        ],
      });
    }
  };

  const onAction = (type: string) => {
    if (!ACTIONS.hasOwnProperty(type)) {
      return;
    }

    props.context.map.current.map.getCanvas().style.cursor =
      ACTIONS[type].cursor;
    setCurrentAction(type);
  };

  const onInit = async () => {
    const map = props.context?.map?.current?.map;

    if (!map) {
      return;
    }

    map.setStyle(`${apiUrl}/maps/style?base=true&dt=${Date.now()}`);

    if (map.getLayer("newTrees")) {
      return;
    }

    map.doubleClickZoom.disable();
    map.boxZoom.disable();

    const response = await fetch(`${apiUrl}/organization/geojson/1`);
    const geojson = await response.json();

    if (geojson.features) {
      setFeatures(geojson.features);
    }

    map.addLayer({
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
          stops: [[12, 5]],
        },
        "circle-color": [
          "case",
          ["==", ["feature-state", "active"], true],
          "red",
          "#2597e4",
        ],
      },
    });
  };

  const onExit = () => {
    const map = props.context?.map?.current?.map;

    if (map) {
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.setStyle(`${apiUrl}/maps/style?dt=${Date.now()}`);
      map.removeLayer("newTrees");
    }
  };

  useEffect(() => {
    onInit();
    return () => onExit();
  }, []);

  useEffect(() => {
    if (features.length) {
      props.context?.map?.current?.map?.getSource("newTrees").setData({
        type: "FeatureCollection",
        features: features,
      });
    }
  }, [features]);

  useEffect(() => {
    props.context?.map?.current?.map?.on("click", ACTIONS[currentAction].event);

    return () => {
      props.context?.map?.current?.map?.off(
        "click",
        ACTIONS[currentAction].event
      );
    };
  }, [currentAction]);

  return (
    <Grid container direction="column" spacing={2} className={classes.grid}>
      <Grid item>
        <Grid item xs>
          <Typography variant="h6" className={classes.title}>
            Mis árboles
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onAction("new")}
              >
                Add
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onAction("selection")}
              >
                Selection
              </Button>
            </Grid>
            <Grid item xs></Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => onDelete()}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {fields.vernacularName}
          </Grid>
          {selection.length <= 1 && (
            <Grid item xs={6}>
              {fields.y}
            </Grid>
          )}
          {selection.length <= 1 && (
            <Grid item xs={6}>
              {fields.x}
            </Grid>
          )}
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
