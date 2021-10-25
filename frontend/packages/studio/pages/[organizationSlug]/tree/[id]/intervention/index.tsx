import { NextPage } from "next";
import { makeStyles, Theme, Container } from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import InterventionsToolbar from "@/components/Interventions/Toolbar";
import InterventionProvider from "@/components/Interventions/Provider";
import InterventionsWorkflow from "@/components/Interventions/Workflow";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";
import TreeProvider from "@/components/Tree/Provider";

export interface TreeInterventionsPageProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const TreeInterventionsPage: NextPage<TreeInterventionsPageProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  const router = useRouter();

  return (
    <TreeProvider
      organizationId={organization?.id}
      treeId={Number(router.query.id)}
    >
      <InterventionProvider>
        <AppLayoutGeneral>
          <Container>
            <InterventionsToolbar />
            <InterventionsWorkflow />
          </Container>
        </AppLayoutGeneral>
      </InterventionProvider>
    </TreeProvider>
  );
};

export default TreeInterventionsPage;
