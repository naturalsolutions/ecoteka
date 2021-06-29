import { FC } from "react";
import { useMeasure } from "react-use";
import { makeStyles, Theme, Grid, useTheme, Button } from "@material-ui/core";
import { useInterventionContext } from "@/components/Interventions/Provider";
import InterventionListContainer from "@/components/Interventions/List/Container";
import InterventionsListItem from "@/components/Interventions/List/Item";

export interface InterventionsWorkflowProps {
  selectable?: boolean;
  showAllInterventions?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionsWorkflow: FC<InterventionsWorkflowProps> = ({
  selectable = true,
  showAllInterventions = true,
}) => {
  const classes = useStyles();
  const { scheduledInterventions, doneInterventions, treeInterventions } =
    useInterventionContext();
  const [ref, measure] = useMeasure();
  const theme = useTheme();

  const isMobile = measure.width <= theme.breakpoints.values.sm;
  const sm = isMobile ? 12 : 6;

  return (
    <Grid ref={ref} container spacing={2}>
      {!showAllInterventions && (
        <Grid item xs={12} sm={sm}>
          <InterventionListContainer
            label="interventions planifiées"
            allowNewInterventions={true}
          >
            {treeInterventions?.map((intervention) => (
              <InterventionsListItem
                key={`intervention-${intervention.id}`}
                selectable={selectable}
                intervention={intervention}
              />
            ))}
          </InterventionListContainer>
        </Grid>
      )}
      {showAllInterventions && (
        <>
          <Grid item xs={12} sm={sm}>
            <InterventionListContainer label="interventions planifiées">
              {scheduledInterventions?.map((intervention) => (
                <InterventionsListItem
                  key={`intervention-${intervention.id}`}
                  selectable={selectable}
                  intervention={intervention}
                />
              ))}
            </InterventionListContainer>
          </Grid>
          <Grid item xs={12} sm={sm}>
            <InterventionListContainer label="interventions réalisées">
              {doneInterventions?.map((intervention) => (
                <InterventionsListItem
                  key={`intervention-${intervention.id}`}
                  selectable={selectable}
                  intervention={intervention}
                />
              ))}
            </InterventionListContainer>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default InterventionsWorkflow;
