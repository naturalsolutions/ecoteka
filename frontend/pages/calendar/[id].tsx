import { FC, useState } from "react";
import { Grid, makeStyles, Button, Box } from "@material-ui/core";
import Calendar from "@/components/Calendar/Index";
import { apiRest } from "@/lib/api";

const useStyles = makeStyles((theme) => {
  return {};
});

const CalendarPage = ({}) => {
  const classes = useStyles();

  const getCalendarData = async (year) => {
    const result = {};
    const data = await apiRest.interventions.getByYear(year);

    data.forEach((it) => {
      const r = {
        ...it,
        intervention_start_date: new Date(it.intervention_start_date),
        intervention_end_date: new Date(it.intervention_end_date),
        date: it.date ? new Date(it.date) : null,
      };
      const startmonth = r.intervention_start_date.getMonth(),
        endmonth = r.intervention_end_date.getMonth();

      for (let i = startmonth; i <= endmonth; i++) {
        result[i] = (result[i] || []).concat(r);
      }
    });

    return result;
  };

  return <Calendar />;
};

export default CalendarPage;
