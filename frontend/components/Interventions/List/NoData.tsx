import { FC } from "react";
import { makeStyles, Theme, Button, Typography, Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAppContext } from "@/providers/AppContext";
import { useTreeContext } from "@/components/Tree/Provider";

export interface InterventionsListNoDataProps {
  allowNewIntervention: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionsListNoData: FC<InterventionsListNoDataProps> = ({
  allowNewIntervention = false,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { organization } = useAppContext();
  const { tree } = useTreeContext();

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
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <img
              src="/assets/interventions/no-data.svg"
              alt="no-intervention-data"
            />
          </Grid>
          <Grid item>
            <Typography variant="body2">
              Aucune intervention n’est prévue
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {allowNewIntervention && (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNewIntervention}
          >
            planifier une intervention
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default InterventionsListNoData;
