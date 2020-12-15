import React from "react";
import dynamic from "next/dynamic";
import { makeStyles, Card, CardContent } from "@material-ui/core";
import ETKMap from "@/components/Map/Map";
import { useAppContext } from "@/providers/AppContext";

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
  start: dynamic(() => import("@/components/Panel/Start/Index")),
  import: dynamic(() => import("@/components/Import/Panel/Index")),
  newTree: dynamic(() => import("@/components/Tree/Form")),
  newIntervention: dynamic(() => import("@/components/Interventions/Form")),
};

const ETKPanel: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { isLoading } = useAppContext();
  let panel = props.panel;

  if (!panel) {
    panel = "start";
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
