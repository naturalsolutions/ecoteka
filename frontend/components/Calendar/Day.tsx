import React, { useState } from "react";
import { makeStyles, Grid, Box } from "@material-ui/core";
import { useTemplate } from "@/components/Template";

export interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
}

const defaultProps: CalendarDayProps = {
  day: 0,
  month: 0,
  year: 0,
};

function isToday(day, month, year) {
  const today = new Date();

  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

const useStyles = makeStyles(() => ({
  root: {},
  item: {
    border: "1px solid #fff",
    textAlign: "center",
    fontWeight: "bold",
  },
}));

const CalendarDay: React.FC<CalendarDayProps> = (props) => {
  const classes = useStyles();
  const { theme } = useTemplate();

  return (
    <Box
      mb={1}
      p={1}
      className={classes.item}
      style={{
        backgroundColor: isToday(props.day, props.month, props.year)
          ? theme?.palette?.info.main
          : undefined,
      }}
    >
      {props.day}
    </Box>
  );
};

CalendarDay.defaultProps = defaultProps;

export default CalendarDay;
