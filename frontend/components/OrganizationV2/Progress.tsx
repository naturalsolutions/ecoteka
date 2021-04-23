import { FC } from "react";
import {
  makeStyles,
  Theme,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import CoreOptionsPanel from "../Core/OptionsPanel";

export interface OrganizationProgressProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const OrganizationProgress: FC<OrganizationProgressProps> = ({}) => {
  const classes = useStyles();

  return (
    <CoreOptionsPanel title={"COMPLeTION DU JEU DE DONNÉES"} items={[]}>
      <Grid container spacing={4}>
        <Grid item xs={6} md={3}>
          <Grid
            container
            direction="column"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress size={60} variant="determinate" value={75} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Noms vernaculaires</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={3}>
          <Grid
            container
            direction="column"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress size={60} variant="determinate" value={75} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Hauteur</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={3}>
          <Grid
            container
            direction="column"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress size={60} variant="determinate" value={75} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Diamètre</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={3}>
          <Grid
            container
            direction="column"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress size={60} variant="determinate" value={75} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Date de plantation</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CoreOptionsPanel>
  );
};

export default OrganizationProgress;
