import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { makeStyles, Paper, Card, CardContent } from "@material-ui/core";
import ETKMap from "../components/Map/Map";
import { useAppContext } from "../providers/AppContext";

export type ETKPanelContext = {
  map: React.RefObject<ETKMap> | undefined;
};

export interface ETKPanelProps {
  panel: string | undefined;
  context: ETKPanelContext;
}

const defaultProps: ETKPanelProps = {
  panel: undefined,
  context: undefined,
};

const useStyles = makeStyles(() => ({
  paper: {
    height: "100%",
    overflowY: "auto",
  },
}));

const ETKPanelPanels = {
  start: dynamic(() => import("./Panel/Start")),
  welcome: dynamic(() => import("./Panel/Welcome")),
  import: dynamic(() => import("./Import/Panel/Index")),
  newTree: dynamic(() => import("./Tree/Form")),
  newIntervention: dynamic(() => import("./Interventions/Form"))
};

const ETKPanel: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { user, isLoading } = useAppContext();
  let panel = props.panel;

  if (!panel) {
    panel = user ? "start" : "welcome";
  }

  if (!user) {
    panel = "welcome";
  }

  const Panel = ETKPanelPanels[panel];

  return isLoading ? (
    <Panel />
  ) : (
    <Card elevation={0} square className={classes.paper}>
      <CardContent>
        <Panel context={props.context} />
      </CardContent>
    </Card>
  );
};

ETKPanel.defaultProps = defaultProps;

export default ETKPanel;
