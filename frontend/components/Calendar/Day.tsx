import React, { useState } from "react";
import { makeStyles, Grid, Box } from "@material-ui/core";
import { useTemplate } from "@/components/Template";
import { useDrop } from "react-dnd";
import { DragObjectWithType } from "react-dnd/lib/interfaces/hooksApi";
import { ItemTypes } from "@/components/Calendar/ItemTypes";
import { apiRest } from "@/lib/api";

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
    marginBottom: ".5rem",
  },
}));

interface InterventionType extends DragObjectWithType {
  id: number;
}

const CalendarDay: React.FC<CalendarDayProps> = (props) => {
  const classes = useStyles();
  const { theme } = useTemplate();
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: async function (newItem: InterventionType) {
      try {
        /*const response = await apiRest.interventions.plan(
          newItem.id,
          props.date
        );

        if (response.ok) {
          const internention = await response.json();
          const date = new Date(props.date);
          props.onInterventionPlanified(internention, date.getMonth());
        }*/
        console.log(props);
      } catch (e) {}
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={classes.item}
      style={{
        backgroundColor: isToday(props.day, props.month, props.year)
          ? theme?.palette?.info.main
          : undefined,
      }}
    >
      {props.day}
    </div>
  );
};

CalendarDay.defaultProps = defaultProps;

export default CalendarDay;
