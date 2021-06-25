import { FC } from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import InterventionsToolbar from "@/components/Interventions/Toolbar";
import InterventionProvider from "@/components/Interventions/Provider";
import InterventionsWorkflow from "@/components/Interventions/Workflow";
import { useAppContext } from "@/providers/AppContext";

export interface OrganizationInterventionsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const OrganizationInterventions: FC<OrganizationInterventionsProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();

  return (
    <InterventionProvider organizationSlug={organization.slug}>
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
