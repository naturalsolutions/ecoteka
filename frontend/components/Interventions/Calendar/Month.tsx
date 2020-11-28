import React from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import Day from "@/components/Interventions/Calendar/Day";
import { useTranslation } from "react-i18next";
import { TIntervention } from "@/components/Interventions/Schema";
import CalendarTodoIntervention from "@/components/Interventions/Calendar/TodoIntervention";

export interface CalendarMonthProps {
  interventions: TIntervention[];
  month: number;
  year: number;
  onInterventionPlan?(intervention: TIntervention): void;
}

const defaultProps: CalendarMonthProps = {
  interventions: [],
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
  item: {
    textAlign: "center",
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

    const filterInterventionsDay = (day) => {
      return (intervention: TIntervention) => {
        if (!intervention.date) {
          return false;
        }

        const interventionDay = new Date(intervention.date).getDate();

        return interventionDay === day;
      };
    };

    range(6).map((i) => {
      rows.push(
        <Grid
          container
          key={`row-${i}`}
          alignItems="stretch"
          spacing={1}
          wrap="nowrap"
        >
          {range(7).map((j) => {
            if (i === 0 && j < firstDay - 1) {
              return <Grid xs item key={`day-${i}-${j}`} />;
            }

            if (day > totalDays) {
              return <Grid xs item key={`day-${i}-${j}`} />;
            }

            return (
              <Grid xs item key={`day-${i}-${j}`} className={classes.item}>
                <Day
                  day={day}
                  month={props.month}
                  year={props.year}
                  interventions={props.interventions.filter(
                    filterInterventionsDay(day++)
                  )}
                  onInterventionPlan={props.onInterventionPlan}
                />
              </Grid>
            );
          })}
        </Grid>
      );
    });

    return rows;
  };

  const filterTodoInterventions = (intervention) => {
    if (intervention.date) {
      return false;
    }

    const startMonth = new Date(
      intervention.intervention_start_date
    ).getMonth();
    const endMonth = new Date(intervention.intervention_end_date).getMonth();

    return !(props.month < startMonth || props.month > endMonth);
  };

  const renderTodoInterventions = () =>
    props.interventions
      .filter(filterTodoInterventions)
      .map((todoIntervention) => {
        return (
          <CalendarTodoIntervention
            key={`todo-intervention-${todoIntervention.id}`}
            todoIntervention={todoIntervention}
          />
        );
      });

  return (
    <Card className={classes.root} square elevation={1}>
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="h5">
                  {t("common:months", { returnObjects: true })[props.month]}
                </Typography>
              </Grid>
              <Grid item xs>
                <Grid container spacing={2}>
                  {renderTodoInterventions()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              spacing={2}
              alignItems="stretch"
              justify="flex-start"
            >
              {renderDays()}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CalendarMonth.defaultProps = defaultProps;

export default CalendarMonth;
