import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import Month from "@/components/Interventions/Calendar/Month";
import Header from "@/components/Interventions/Calendar/Header";
import Filter from "@/components/Interventions/Calendar/Filter";
import { TIntervention } from "@/components/Interventions/Schema";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [filters, setFilters] = useState([]);

  const handleFilterChange = (filters) => {
    setFilters(filters);
  };

  const filterInterventionMonth = (month) => {
    return (intervention: TIntervention) => {
      const interventionStartMonth = new Date(
        intervention.intervention_start_date
      ).getMonth();
      const interventionEndMonth = new Date(
        intervention.intervention_end_date
      ).getMonth();
      const interventionDateMonth = new Date(intervention.date).getMonth();

      return (
        interventionDateMonth === month ||
        (interventionStartMonth >= month && interventionEndMonth <= month)
      );
    };
  };

  const renderMonths = () => {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(
        <Grid key={`month-${i}`} item xs={3}>
          <Month
            month={i}
            year={props.year}
            interventions={props.interventions
              .filter((intervention) =>
                filters.includes(intervention.intervention_type)
              )
              .filter(filterInterventionMonth(i))}
          />
        </Grid>
      );
    }

    return months;
  };

  const handleNewIntervention = () => {
    router.push("/?panel=newIntervention");
  };

  console.log(props.interventions);

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper square className={classes.root}>
        <Grid container>
          <Grid item>
            <Card
              elevation={0}
              square
              style={{ backgroundColor: "transparent" }}
            >
              <CardContent>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h5">
                      Calandrier d'interventions
                    </Typography>
                    <Box mb={3} />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleNewIntervention}
                    >
                      Demander une intervention
                    </Button>
                  </Grid>
                  <Grid item>
                    <Filter onChange={handleFilterChange} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card style={{ backgroundColor: "transparent" }}>
              <CardContent>
                <Header year={props.year} onYearChange={props.onYearChange} />
                <Divider />
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="stretch"
                >
                  {renderMonths()}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </DndProvider>
  );
};

Calendar.defaultProps = defaultProps;

export default Calendar;
