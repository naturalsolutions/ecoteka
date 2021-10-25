import { FC } from "react";
import { makeStyles, Theme, Typography, Grid } from "@material-ui/core";

export interface InterventionsListNoDataProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionsListNoData: FC<InterventionsListNoDataProps> = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item>
        <Grid
          container
          direction="column"
          justifyContent="center"
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
    </Grid>
  );
};

export default InterventionsListNoData;
