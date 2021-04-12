import React, { useState } from "react";
import { Container, Grid, makeStyles, Paper, Box } from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import TreePageHeader, { Mode } from "@/components/Tree/Page/Header";
import TreeImagesContainer from "@/components/Tree/Images/Container";
import TreeBasicForm from "@/components/Tree/BasicForm";
import TreeForm from "@/components/Tree/Form";
import TreeInterventions from "@/components/Tree/Interventions";
import TreeHealthAssessment from "@/components/Tree/HealthAssessment";
import TreeProvider from "@/components/Tree/Provider";

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
  const router = useRouter();
  const { id } = router.query;
  const { organization } = useAppContext();
  const [readOnly, setReadOnly] = useState<boolean>(true);

  const handleOnAction = async (mode: Mode) => {
    setReadOnly(mode === "read");
  };

  return id ? (
    <AppLayoutGeneral>
      <TreeProvider organizationId={organization.id} treeId={Number(id)}>
        <Container>
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
                      <TreeBasicForm readOnly={readOnly} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TreeInterventions />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TreeHealthAssessment />
              </Grid>
              <Grid item xs={12}>
                <TreeForm readOnly={readOnly} />
              </Grid>
              <Grid item>
                <Box my={4} />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </TreeProvider>
    </AppLayoutGeneral>
  ) : null;
};

export default TreePage;
