import React from "react";
import dynamic from "next/dynamic";
import { makeStyles, Card, CardContent } from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";

export interface PanelProps {
  panel: string | undefined;
  info?: object;
}

const defaultProps: PanelProps = {
  panel: undefined,
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
  newIntervention: dynamic(() => import("@/components/Interventions/Form")),
};

const Panel: React.FC<PanelProps> = ({ panel, info }) => {
  const classes = useStyles();
  const { isLoading } = useAppContext();

  if (!panel) {
    panel = "start";
  }

  const Panel = PanelPanels[panel];

  return isLoading ? (
    <Panel />
  ) : (
    <Card elevation={0} square className={classes.paper}>
      <CardContent>
        <Panel info={info} />
      </CardContent>
    </Card>
  );
};

Panel.defaultProps = defaultProps;

export default Panel;
