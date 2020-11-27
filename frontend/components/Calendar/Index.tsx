import React, { useEffect, useState } from "react";
import { makeStyles, Grid, Paper, Divider } from "@material-ui/core";
import Month from "@/components/Calendar/Month";
import Header from "@/components/Calendar/Header";
import Filter from "@/components/Calendar/Filter";
import {
  TIntervention,
  TInterventionType,
} from "@/components/Interventions/Schema";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export interface CalendarProps {
  interventions: TIntervention[];
  year: number;
  onYearChange?(newYear: number): void;
}

const TODAY = new Date();

const defaultProps: CalendarProps = {
  interventions: [],
  year: TODAY.getFullYear(),
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}));

const Calendar: React.FC<CalendarProps> = (props) => {
  const classes = useStyles();
  const [filters, setFilters] = useState([]);
  const [todoInterventions, setTodoInterventions] = useState<TIntervention[]>(
    []
  );

  useEffect(() => {
    const newTodoInterventions = props.interventions.filter((f) => !f.done);

    setTodoInterventions(newTodoInterventions);
  }, [props.interventions]);

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const renderMonths = () => {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(
        <Grid key={`month-${i}`} item xs={3}>
          <Month month={i} year={props.year} />
        </Grid>
      );
    }

    return months;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper square className={classes.root}>
        <Grid container>
          <Grid item>
            <Filter onChange={handleFilterChange} />
          </Grid>
          <Grid item xs>
            <Header
              year={props.year}
              todoInterventions={todoInterventions.filter((todoIntervention) =>
                filters.includes(todoIntervention.intervention_type)
              )}
              onYearChange={props.onYearChange}
            />
            <Divider />
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
            >
              {renderMonths()}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </DndProvider>
  );
};

Calendar.defaultProps = defaultProps;

export default Calendar;
