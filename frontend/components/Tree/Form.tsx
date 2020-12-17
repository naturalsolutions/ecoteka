import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useETKTreeSchema from "@/components/Tree/Schema";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import { useAppLayout } from "@/components/appLayout/Base";
import { ITree } from "@/index";

const useStyles = makeStyles((theme) => ({
  grid: {},
  title: {
    fontWeight: "bold",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: "bold",
  },
}));

const ETKTreeForm: React.FC<{
  selection: { id: number; properties: { id: number; properties: {} } }[];
}> = ({ selection }) => {
  const { t } = useTranslation(["common", "components"]);
  const classes = useStyles();
  const schema = useETKTreeSchema();
  const { snackbar } = useAppLayout();
  const [saving, setSaving] = useState(false);
  const { fields, setValue, getValues } = useETKForm({
    schema: schema,
  });
  const { user } = useAppContext();

  useEffect(() => {
    if (selection.length === 1) {
      for (let key in selection[0].properties.properties) {
        setValue(key, selection[0].properties.properties[key]);
      }
    }
  }, [selection]);

  const handlerOnSave = async () => {
    setSaving(true);
    const properties = getValues();
    const response = await apiRest.trees.put(
      user.currentOrganization.id,
      selection[0].properties.id,
      {
        properties: properties,
      }
    );

    if (response.ok) {
      const newTree = (await response.json()) as ITree;
      snackbar.current.open({
        message: t("common:messages.success"),
        autoHideDuration: 2000,
      });
    }

    setSaving(false);
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.grid}>
      <Grid item>
        <Typography variant="h6" className={classes.title}>
          Edition
        </Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.heading}>Identité de l'arbre</Typography>
        <Grid container direction="column">
          {Object.keys(schema)
            .filter((f) => schema[f].category === "Identité de l'arbre")
            .map((f) => (
              <Grid key={`${schema[f].category}-${f}`} item>
                {fields[f]}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Typography className={classes.heading}>Caractéristiques</Typography>
        <Grid container direction="column">
          {Object.keys(schema)
            .filter((f) => schema[f].category === "Caractéristiques")
            .map((f) => (
              <Grid key={`${schema[f].category}-${f}`} item>
                {fields[f]}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Typography className={classes.heading}>
          Environnement extérieur
        </Typography>
        <Grid container direction="column">
          {Object.keys(schema)
            .filter((f) => schema[f].category === "Environnement extérieur")
            .map((f) => (
              <Grid key={`${schema[f].category}-${f}`} item>
                {fields[f]}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Typography className={classes.heading}>Autre</Typography>

        <Grid container direction="column">
          {Object.keys(schema)
            .filter((f) => schema[f].category === "Autre")
            .map((f) => (
              <Grid key={`${schema[f].category}-${f}`} item>
                {fields[f]}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item xs></Grid>
          <Grid item>
            <Button color="primary" variant="contained" onClick={handlerOnSave}>
              {saving ? <CircularProgress size={30} /> : "Enregistrer"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ETKTreeForm;
