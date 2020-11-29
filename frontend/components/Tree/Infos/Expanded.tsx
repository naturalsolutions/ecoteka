import React from "react";
import {
  Button,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import TreeAccordion from "@/components/Tree/TreeAccordion";
import { TIntervention } from "@/components/Interventions/Schema";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { ITree } from "@/index";

export interface ETKTreeInfosExpandedProps {
  open: boolean;
  tree?: ITree;
  interventions?: TIntervention[];
  onClose?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {
  open: false,
};

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = (props) => {
  const [scroll, setScroll] = React.useState("paper");

  const handlerOnSave = async () => {};

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
              <InterventionsTable
                interventions={props.interventions}
                tree={props.tree}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlerOnSave()}
            >
              Enregistrer
            </Button>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button onClick={props.onClose}>Fermer</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
