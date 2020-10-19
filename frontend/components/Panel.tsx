import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { makeStyles, Paper, Card, CardContent } from "@material-ui/core";
import ETKMap from "../components/Map/Map";
import { useAppContext } from "../providers/AppContext";

type ETKPanelContext = {
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
  },
}));

const ETKPanelPanels = {
  start: dynamic(() => import("./Panel/Start")),
  welcome: dynamic(() => import("./Panel/Welcome")),
  import: dynamic(() => import("./Import/Panel/Index")),
};

const ETKPanel: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { user, isLoading } = useAppContext();
  let panel = props.panel;

  if (!panel) {
    panel = user ? "start" : "welcome";
  }

  const Panel = ETKPanelPanels[panel];

  return isLoading ? null : (
    <Paper square elevation={0} className={classes.paper}>
      <Card elevation={0} square>
        <CardContent>
          <Panel context={props.context} />
        </CardContent>
      </Card>
    </Paper>
  );
};

ETKPanel.defaultProps = defaultProps;

export default ETKPanel;
