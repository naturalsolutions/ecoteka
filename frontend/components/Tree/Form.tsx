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
import { DevTool } from "@hookform/devtools";
import useETKTreeSchema from "@/components/Tree/Schema";
import { useSnackbar } from "notistack";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import { useAppLayout } from "@/components/AppLayout/Base";

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
  selection: {
    id: number;
    properties: { id: number; properties: {} };
  }[];
  onSave?(record: object): void;
}> = ({ selection, onSave }) => {
  const { t } = useTranslation(["common", "components"]);
  const classes = useStyles();
  const schema = useETKTreeSchema();
  const { api } = useApi();
  const { apiETK } = api;
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const { user } = useAppContext();
  const defaultValues = {
    isLit: false,
    isProtected: false,
    isTreeOfInterest: false,
  };
  const { fields, setValue, getValues, control } = useETKForm({
    schema,
    defaultValues,
  });

  useEffect(() => {
    if (selection.length === 1) {
      console.log(selection);
      for (let key in selection[0].properties.properties) {
        setValue(key, selection[0].properties.properties[key]);
      }
    }
  }, [selection]);

  const handlerOnSave = async () => {
    try {
      setSaving(true);

      if (!selection.length) return;

      const properties = getValues();
      const organizationId = user.currentOrganization.id;
      const treeId = selection[0].properties.id;

      const { data, status } = await apiETK.put(
        `/organization/${organizationId}/trees/${treeId}`,
        {
          properties,
        }
      );
      if (status === 200) {
        onSave(data);
        enqueueSnackbar("Arbre mis à jour avec succès", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
      }
    } catch (e) {
      //
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Grid container direction="column" spacing={2} className={classes.grid}>
        <Grid item>
          <Typography variant="h6" className={classes.title}>
            {t("components:TreeForm.title")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.heading}>
            {t("components:TreeForm.treeIdentity")}
          </Typography>
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
          <Typography className={classes.heading}>
            {t("components:TreeForm.characteristics")}
          </Typography>
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
            {t("components:TreeForm.outdoorEnvironment")}
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
          <Typography className={classes.heading}>
            {t("components:TreeForm.other")}
          </Typography>

          <Grid container direction="column">
            {Object.keys(schema)
              .filter((f) => schema[f].category === "Autres")
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
              <Button
                color="primary"
                variant="contained"
                onClick={handlerOnSave}
              >
                {saving ? (
                  <CircularProgress size={30} />
                ) : (
                  t("common:buttons.save")
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DevTool control={control} />
    </>
  );
};

export default ETKTreeForm;
