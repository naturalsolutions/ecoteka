import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useForm from "@/components/Form/useForm";
import useTreeSchema from "@/components/Tree/Schema";
import { useSnackbar } from "notistack";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
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

const TreeForm: React.FC<{
  tree: ITree;
  onSave?(record: object): void;
}> = ({ tree, onSave }) => {
  const { t } = useTranslation(["common", "components"]);
  const classes = useStyles();
  const schema = useTreeSchema();
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
  const { fields, setValue, getValues } = useForm({
    schema,
    defaultValues,
  });

  useEffect(() => {
    for (let key in tree.properties) {
      setValue(key, tree[key]);
    }
  }, [tree]);

  const handlerOnSave = async () => {
    try {
      setSaving(true);

      if (!tree) return;

      const properties = getValues();
      const organizationId = user.currentOrganization.id;

      const { data, status } = await apiETK.put(
        `/organization/${organizationId}/trees/${tree.id}`,
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
      console.log(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Grid container direction="column" spacing={2} className={classes.grid}>
        <Grid item>
          <Typography variant="h6" className={classes.title}>
            {t("components.TreeForm.title")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.heading}>
            {t("components.TreeForm.treeIdentity")}
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
            {t("components.TreeForm.characteristics")}
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
            {t("components.TreeForm.outdoorEnvironment")}
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
            {t("components.TreeForm.other")}
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
                  t("common.buttons.save")
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default TreeForm;
