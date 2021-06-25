import { FC } from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import InterventionsToolbar from "@/components/Interventions/Toolbar";
import InterventionProvider from "@/components/Interventions/Provider";
import InterventionsWorkflow from "@/components/Interventions/Workflow";

export interface OrganizationInterventionsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const OrganizationInterventions: FC<OrganizationInterventionsProps> = ({}) => {
  const classes = useStyles();

  return (
    <InterventionProvider>
      <AppLayoutGeneral>
        <Container>
          <InterventionsToolbar />
          <InterventionsWorkflow />
        </Container>
      </AppLayoutGeneral>
    </InterventionProvider>
  );
};

export default OrganizationInterventions;
