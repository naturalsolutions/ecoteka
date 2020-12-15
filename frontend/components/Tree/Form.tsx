import React, { useEffect } from "react";
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
import useETKForm from "@/components/Form/useForm";
import { ETKPanelProps } from "@/components/Panel";
import useETKTreeSchema from "@/components/Tree/Schema";

const useStyles = makeStyles((theme) => ({
  grid: {
    minWidth: "25rem",
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
  const { t } = useTranslation("components");
  const classes = useStyles();
  const schema = useETKTreeSchema();
  const { fields, handleSubmit, setValue } = useETKForm({ schema: schema });

  const onSubmit = async (data) => {};

  const setLngLat = ([lng, lat]) => {
    setValue("x", lng);
    setValue("y", lat);
  };

  const onClick = (e) => {
    setLngLat([e.lngLat.lng, e.lngLat.lat]);
  };

  const onGeolocate = (e) => {
    setLngLat([e.coords.longitude, e.coords.latitude]);
  };

  useEffect(() => {
    props.context?.map?.current?.map.on("click", onClick);
    props.context?.map?.current?.map.geolocate.on("geolocate", onGeolocate);

    return () => {
      props.context?.map?.current?.map.off("click", onClick);
      props.context?.map?.current?.map.geolocate.off("geolocate", onGeolocate);
    };
  }, []);

  return (
    <Grid container direction="column" spacing={2} className={classes.grid}>
      <Grid item>
        <Typography variant="h6" className={classes.title}>
          Ajouter un arbre
        </Typography>
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
                .filter((f) => schema[f].category === "Identité de l'arbre")
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
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </Grid>
    </Grid>
  );
};

export default ETKTreeForm;
