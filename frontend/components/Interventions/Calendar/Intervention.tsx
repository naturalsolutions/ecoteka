import React from "react";
import { makeStyles } from "@material-ui/core";

export interface CalendarInterventionProps {}

const defaultProps: CalendarInterventionProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const CalendarIntervention: React.FC<CalendarInterventionProps> = (props) => {
  const classes = useStyles();

  return <div>aaaa</div>;
};

CalendarIntervention.defaultProps = defaultProps;

export default CalendarIntervention;
