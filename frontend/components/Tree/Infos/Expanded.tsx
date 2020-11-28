import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Dialog,
} from "@material-ui/core";
import TreeAccordion from "../TreeAccordion";
import InterventionsTable from "@/components/Interventions/InterventionsTable";

export interface ETKTreeInfosExpandedProps {
  open: boolean;
  onClose?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {
  open: false,
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = (props) => {
  return (
    <Dialog open={props.open} fullWidth fullScreen>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper>
            <TreeAccordion id={1} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>{false && <InterventionsTable interventions={[]} />}</Paper>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={props.onClose}>
        Réduire
      </Button>
    </Dialog>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
