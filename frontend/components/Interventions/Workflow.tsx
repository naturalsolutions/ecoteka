import { FC } from "react";
import { makeStyles, Theme, Grid, useTheme, Button } from "@material-ui/core";
import { useInterventionContext } from "@/components/Interventions/Provider";
import InterventionListContainer from "@/components/Interventions/List/Container";
import InterventionsListItem from "./List/Item";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTreeContext } from "../Tree/Provider";

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
  const { scheduledInterventions, doneInterventions } =
    useInterventionContext();
  const [ref, measure] = useMeasure();
  const theme = useTheme();
  const router = useRouter();
  const { organization } = useAppContext();
  const { tree } = useTreeContext();
  const isMobile = measure.width <= theme.breakpoints.values.sm;
  const sm = isMobile ? 12 : 6;

  const handleNewIntervention = () => {
    router.push({
      pathname: "/[organizationSlug]/map",
      query: {
        panel: "intervention",
        tree: tree.id,
        organizationSlug: organization.slug,
      },
    });
  };

  return (
    <Grid ref={ref} container spacing={2}>
      <Grid item xs={12} sm={sm}>
        <InterventionListContainer label="interventions planifiées">
          {scheduledInterventions?.map((intervention) => (
            <InterventionsListItem
              key={`intervention-${intervention.id}`}
              selectable={selectable}
              intervention={intervention}
            />
          ))}
          {!showAllInterventions && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleNewIntervention}
            >
              planifier une intervention
            </Button>
          )}
        </InterventionListContainer>
      </Grid>
      {showAllInterventions && (
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
      )}
    </Grid>
  );
};

export default InterventionsWorkflow;
