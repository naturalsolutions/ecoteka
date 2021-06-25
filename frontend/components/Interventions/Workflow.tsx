import { FC } from "react";
import { makeStyles, Theme, Grid, Divider } from "@material-ui/core";
import { useInterventionContext } from "@/components/Interventions/Provider";
import InterventionListContainer from "@/components/Interventions/List/Container";
import InterventionsListItem from "./List/Item";

export interface InterventionsWorkflowProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionsWorkflow: FC<InterventionsWorkflowProps> = ({}) => {
  const classes = useStyles();
  const { scheduledInterventions, doneInterventions } =
    useInterventionContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <InterventionListContainer title="interventions planifiées">
          {scheduledInterventions.map((intervention) => (
            <InterventionsListItem
              key={`intervention-${intervention.id}`}
              intervention={intervention}
            />
          ))}
        </InterventionListContainer>
      </Grid>
      <Grid item xs={12} sm={6}>
        <InterventionListContainer title="interventions réalisées">
          {doneInterventions.map((intervention) => (
            <InterventionsListItem
              key={`intervention-${intervention.id}`}
              intervention={intervention}
            />
          ))}
        </InterventionListContainer>
      </Grid>
    </Grid>
  );
};

export default InterventionsWorkflow;
