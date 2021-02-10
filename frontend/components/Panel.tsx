import React from "react";
import dynamic from "next/dynamic";
import { makeStyles, Card, CardContent } from "@material-ui/core";
import ETKMap from "@/components/Map/Map";
import { useAppContext } from "@/providers/AppContext";

export type PanelContext = {
  map: React.RefObject<ETKMap> | undefined;
};

export interface PanelProps {
  panel: string | undefined;
}

const defaultProps: PanelProps = {
  panel: undefined,
  context: undefined,
};

const useStyles = makeStyles(() => ({
  paper: {
    height: "100%",
    overflowY: "auto",
  },
}));

const PanelPanels = {
  start: dynamic(() => import("@/components/Panel/Start/Index")),
  import: dynamic(() => import("@/components/Import/Panel/Index")),
  newTree: dynamic(() => import("@/components/Tree/Form")),
  newIntervention: dynamic(() => import("@/components/Interventions/Form")),
};

const Panel: React.FC<PanelProps> = (props) => {
  const classes = useStyles();
  const { isLoading } = useAppContext();
  let panel = props.panel;

  if (!panel) {
    panel = "start";
  }

  const Panel = PanelPanels[panel];

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

Panel.defaultProps = defaultProps;

export default Panel;
