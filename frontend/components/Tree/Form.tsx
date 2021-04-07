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
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";

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
  onSave?(record: object): void;
}> = ({ onSave }) => {
  const [active, setActive] = useState<boolean>(false);
  const { t } = useTranslation(["common", "components"]);
  const router = useRouter();
  const classes = useStyles();
  const schema = useTreeSchema();
  const { api } = useApi();
  const { apiETK } = api;
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const { organization } = useAppContext();
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
    const { query, route } = router;

    if (
      route === "/[organizationSlug]/map" &&
      query.panel === "edit" &&
      query.tree
    ) {
      setActive(true);
      getTree(organization.id, Number(query.tree));
    } else {
      setActive(false);
    }
  }, [router.query]);

  const handlerOnSave = async () => {
    try {
      setSaving(true);

      const properties = getValues();
      const organizationId = organization.id;
      const { data, status } = await apiETK.put(
        `/organization/${organizationId}/trees/${router.query.tree}`,
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
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "info",
        tree: router.query.tree,
        organizationSlug: organization.slug,
      },
    });
  };

  if (active) {
    return (
      <AppLayoutCartoDialog
        title={t("components.TreeForm.title")}
        actions={
          <Grid container>
            <Grid item>
              <Button
                size="small"
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
                size="small"
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
        }
      >
        <Grid container direction="column" spacing={2} className={classes.grid}>
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
      </AppLayoutCartoDialog>
    );
  }

  return null;
};

export default TreeForm;
