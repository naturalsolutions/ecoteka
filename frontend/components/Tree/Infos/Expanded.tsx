import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import TreeAccordion from "../TreeAccordion";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { useQuery } from "react-query";
import { apiRest } from "@/lib/api";

export interface ETKTreeInfosExpandedProps {
  id?: number;
  showLess?: () => void;
}

const defaultProps: ETKTreeInfosExpandedProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = ({
  id,
  showLess,
}) => {
  const classes = useStyles();

  const { data: interventions } = useQuery(
    `tree_${id}_interventions`,
    async () => {
      const data = await apiRest.trees.getInterventions(id);
      return data;
    },
    {
      enabled: Boolean(id),
    }
  );

  return (
    <Box>
      <Grid container>
        <Grid item xs={6}>
          <Paper>
            <TreeAccordion id={id} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            {interventions && (
              <InterventionsTable interventions={interventions} />
            )}
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={showLess}>
        Réduire
      </Button>
    </Box>
  );
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
