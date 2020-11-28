import React from "react";
import { TIntervention } from "@/components/Interventions/Schema";
import { INTERVENTION_COLORS } from "@/components/Interventions/Calendar/index.d";
import { makeStyles } from "@material-ui/core";
import { useTemplate } from "@/components/Template";

export interface CalendarInterventionProps {
  intervention: TIntervention;
}

const defaultProps: CalendarInterventionProps = {
  intervention: undefined,
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const CalendarIntervention: React.FC<CalendarInterventionProps> = (props) => {
  const classes = useStyles();
  const { dialog } = useTemplate();
  const backgroundColor =
    INTERVENTION_COLORS[props.intervention.intervention_type];

  const handleInterventionDialog = () => {
    dialog.current.open({
      title: props.intervention.intervention_type,
      content: "",
      actions: [
        {
          label: "Close",
        },
      ],
    });
  };

  return (
    <div
      onClick={handleInterventionDialog}
      style={{
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        width: "10px",
        height: "10px",
        marginRight: "2px",
      }}
    />
  );
};

CalendarIntervention.defaultProps = defaultProps;

export default CalendarIntervention;
