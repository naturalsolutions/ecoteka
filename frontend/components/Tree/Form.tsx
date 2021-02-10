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
import { useRouter } from "next/router";

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
  treeId: number;
  onSave?(record: object): void;
}> = ({ treeId, onSave }) => {
  const { t } = useTranslation(["common", "components"]);
  const router = useRouter();
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

  async function getTree(organizationId, treeId) {
    try {
      const url = `/organization/${organizationId}/trees/${treeId}`;

      const { status, data } = await apiETK.get(url);

      if (status === 200) {
        for (let key in data.properties) {
          setValue(key, data.properties[key]);
        }
      }
    } catch (e) {}
  }

  useEffect(() => {
    if (typeof treeId === "number") {
      getTree(user.currentOrganization.id, treeId);
    }
  }, [treeId]);

  const handlerOnSave = async () => {
    try {
      setSaving(true);

      const properties = getValues();
      const organizationId = user.currentOrganization.id;

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
    } finally {
      setSaving(false);
    }
  };

  const handleToBack = () => {
    router.push(`/map?panel=info&tree=${treeId}`);
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
          <Grid container>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToBack}
              >
                {t("components.TreeForm.backToInfo")}
              </Button>
            </Grid>
            <Grid item xs />
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
      </Grid>
    </>
  );
};

export default TreeForm;
