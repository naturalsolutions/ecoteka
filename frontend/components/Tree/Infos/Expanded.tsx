import React from "react";
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import TreeAccordion from "../TreeAccordion";
import { TIntervention } from "@/components/Interventions/Schema";
import InterventionsTable from "@/components/Interventions/InterventionsTable";

export interface ETKTreeInfosExpandedProps {
  open: boolean;
  tree?: object;
  interventions?: TIntervention[];
  onClose?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {
  open: false,
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = (props) => {
  const [scroll, setScroll] = React.useState("paper");

  return (
    <Dialog maxWidth="xl" open={props.open} fullWidth>
      <DialogContent dividers={scroll === "paper"}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper>
              <TreeAccordion tree={props.tree} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <InterventionsTable interventions={props.interventions} />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={props.onClose}>
          Réduire
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
