import React, { useState } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Box,
  useTheme,
} from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import TreePageHeader, { Mode } from "@/components/Tree/Page/Header";
import TreeImagesContainer from "@/components/Tree/Images/Container";
import TreeBasicForm from "@/components/Tree/BasicForm";
import TreeForm from "@/components/Tree/Form";
import TreeProvider from "@/components/Tree/Provider";
import InterventionsWorkflow from "@/components/Interventions/Workflow";
import InterventionProvider from "@/components/Interventions/Provider";
import { useMeasure } from "react-use";

export interface ITreePageProps {}

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}));

const TreePage: React.FC<ITreePageProps> = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const { organization } = useAppContext();
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [ref, measure] = useMeasure();
  const theme = useTheme();

  const handleOnAction = async (mode: Mode) => {
    setReadOnly(mode === "read");
  };

  return id ? (
    <AppLayoutGeneral hasFooter={false}>
      <TreeProvider organizationId={organization?.id} treeId={Number(id)}>
        <InterventionProvider>
          <Container data-test="tree-page">
            <Grid container>
              <TreePageHeader onChange={handleOnAction} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.container}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <TreeImagesContainer variant="page" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TreeBasicForm isEditable />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} ref={ref}>
                  <InterventionsWorkflow
                    selectable={false}
                    insidePanel={measure.width <= theme.breakpoints.values.sm}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TreeForm readOnly={false} />
                </Grid>
                <Grid item>
                  <Box my={4} />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </InterventionProvider>
      </TreeProvider>
    </AppLayoutGeneral>
  ) : null;
};

export default TreePage;
