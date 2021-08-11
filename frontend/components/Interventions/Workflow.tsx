import { FC, useContext } from "react";
import { useMeasure } from "react-use";
import {
  makeStyles,
  Theme,
  Grid,
  useTheme,
  IconButton,
} from "@material-ui/core";
import { useInterventionContext } from "@/components/Interventions/Provider";
import InterventionListContainer from "@/components/Interventions/List/Container";
import InterventionsListItem from "@/components/Interventions/List/Item";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTreeContext } from "@/components/Tree/Provider";
import Can, { AbilityContext } from "@/components/Can";
export interface InterventionsWorkflowProps {
  selectable?: boolean;
  insidePanel?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionsWorkflow: FC<InterventionsWorkflowProps> = ({
  selectable = true,
  insidePanel = false,
}) => {
  const classes = useStyles();
  const { scheduledInterventions, doneInterventions } =
    useInterventionContext();
  const [ref, measure] = useMeasure();
  const theme = useTheme();
  const router = useRouter();
  const { organization } = useAppContext();
  const { tree } = useTreeContext();
  const ability = useContext(AbilityContext);

  const isMobile = measure.width <= theme.breakpoints.values.sm;
  const sm = isMobile ? 12 : 6;

  const handleShowTreeInterventions = () => {
    router.push({
      pathname: "/[organizationSlug]/tree/[id]/intervention",
      query: {
        organizationSlug: organization.slug,
        id: tree.id,
      },
    });
  };

  const currentInterventions = insidePanel
    ? scheduledInterventions
        .sort(
          (a, b) =>
            new Date(a.intervention_start_date).getTime() -
            new Date(b.intervention_start_date).getTime()
        )
        .slice(0, 3)
    : scheduledInterventions.sort(
        (a, b) =>
          new Date(a.intervention_start_date).getTime() -
          new Date(b.intervention_start_date).getTime()
      );

  return (
    <Can do="read" on="Interventions">
      <Grid ref={ref} container spacing={2}>
        <Grid item xs={12} sm={sm}>
          <InterventionListContainer
            label="interventions planifiées"
            allowNewInterventions={
              insidePanel && ability.can("create", "Interventions")
            }
            expand={
              insidePanel && (
                <IconButton size="small" onClick={handleShowTreeInterventions}>
                  <OpenInNewIcon />
                </IconButton>
              )
            }
          >
            {currentInterventions?.map((intervention) => (
              <InterventionsListItem
                key={`intervention-${intervention.id}`}
                selectable={selectable}
                intervention={intervention}
              />
            ))}
          </InterventionListContainer>
        </Grid>
        {!insidePanel && (
          <Grid item xs={12} sm={sm}>
            <InterventionListContainer label="interventions réalisées">
              {doneInterventions
                ?.sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((intervention) => (
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
    </Can>
  );
};

export default InterventionsWorkflow;
