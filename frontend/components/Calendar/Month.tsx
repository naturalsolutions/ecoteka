import React from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import Day from "@/components/Calendar/Day";
import { useTranslation } from "react-i18next";

export interface CalendarMonthProps {
  month: number;
  year: number;
}

const defaultProps: CalendarMonthProps = {
  month: 0,
  year: 2020,
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.default,
  },
  dayLabel: {
    fontWeight: 900,
    fontSize: "1.1rem",
  },
}));

function daysInMonth(month, year) {
  return 32 - new Date(year, month, 32).getDate();
}

function range(n) {
  return Array.from(Array(n).keys());
}

const CalendarMonth: React.FC<CalendarMonthProps> = (props) => {
  const classes = useStyles();
  // starting at sunday instead of monday
  const firstDay = new Date(props.year, props.month).getDay() || 7;
  const totalDays = daysInMonth(props.month, props.year);
  const { t } = useTranslation(["common", "components"]);

  const renderDays = () => {
    const rows = [];
    let day = 1;

    const dayLabels = ["L", "M", "X", "J", "V", "S", "D"].map((v) => {
      return (
        <Grid xs item key={`day-label-${v}`}>
          <Grid container justify="center">
            <Grid item>
              <Typography className={classes.dayLabel}>{v}</Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    });

    rows.push(dayLabels);

    range(6).map((i) => {
      rows.push(
        <Grid container key={`row-${i}`} alignItems="stretch" spacing={1}>
          {range(7).map((j) => {
            if (i === 0 && j < firstDay - 1) {
              return <Grid xs item key={`day-${i}-${j}`} />;
            }

            if (day > totalDays) {
              return <Grid xs item key={`day-${i}-${j}`} />;
            }

            return (
              <Grid xs item key={`day-${i}-${j}`}>
                <Day day={day++} month={props.month} year={props.year} />
              </Grid>
            );
          })}
        </Grid>
      );
    });

    return rows;
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        title={t("common:months", { returnObjects: true })[props.month]}
      />
      <CardContent>
        <Grid container spacing={2} alignItems="stretch" justify="flex-start">
          {renderDays()}
        </Grid>
      </CardContent>
    </Card>
  );
};

CalendarMonth.defaultProps = defaultProps;

export default CalendarMonth;
