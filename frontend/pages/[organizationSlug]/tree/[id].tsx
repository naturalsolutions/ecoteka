import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles, Paper, Box } from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import useTree from "@/lib/hooks/useTree";
import { Tree } from "@/index";
import { useAppContext } from "@/providers/AppContext";
import useApi from "@/lib/useApi";
import TreePageHeader, { Mode } from "@/components/Tree/Page/Header";
import TreeImagesContainer from "@/components/Tree/Images/Container";
import TreeBasicForm from "@/components/Tree/BasicForm";
import TreeForm from "@/components/Tree/Form";
import useTreeForm from "@/components/Tree/useForm";
import TreeInterventions from "@/components/Tree/Interventions";
import TreeHealthAssessment from "@/components/Tree/HealthAssessment";

export interface ITreePageProps {}

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    background: theme.palette.background.default,
    padding: theme.spacing(2),
  },
}));

const TreePage: React.FC<ITreePageProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const [tree, setTree] = useState<Tree>();
  const fetchTree = useTree(apiETK);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const form = useTreeForm();

  useEffect(() => {
    if (id && id !== String(tree?.id)) {
      (async () => {
        const newTree = await fetchTree(organization.id, String(id));

        setTree(newTree);
      })();
    }
  }, [id]);

  useEffect(() => {
    if (tree?.properties) {
      Object.keys(tree.properties).forEach((property) =>
        form.setValue(property, tree.properties[property])
      );
    }
  }, [tree]);

  const handleOnAction = async (mode: Mode) => {
    setReadOnly(mode === "read");

    if (mode === "read") {
      try {
        setSaving(true);
        const { data } = await apiETK.put(
          `/organization/${organization.id}/trees/${id}`,
          {
            properties: form.getValues(),
          }
        );

        setTree(data);
      } catch (e) {
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <AppLayoutGeneral>
      <Container>
        <Grid container>
          <TreePageHeader saving={saving} onChange={handleOnAction} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.container}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TreeImagesContainer tree={tree} variant="page" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TreeBasicForm readOnly={readOnly} form={form} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TreeInterventions treeId={tree?.id} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TreeHealthAssessment treeId={tree?.id} />
            </Grid>
            <Grid item xs={12}>
              <TreeForm readOnly={readOnly} form={form} />
            </Grid>
            <Grid item>
              <Box my={4} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppLayoutGeneral>
  );
};

export default TreePage;
