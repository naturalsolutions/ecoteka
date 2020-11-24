import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Paper,
  Box,
  Divider,
  Button,
  IconButton,
  Typography,
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import Month from "@/components/Calendar/Month";
import Filter from "@/components/Calendar/Filter";

export interface CalendarProps {}

const defaultProps: CalendarProps = {};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}));

const TODAY = new Date();

const INTERVENTION_COLORS = {
  pruning: "green",
  felling: "red",
  streanremoval: "brown",
  indepthdiagnostic: "purple",
  treatment: "orange",
  surveillance: "blue",
};

const Calendar: React.FC<CalendarProps> = (props) => {
  const classes = useStyles();
  const [year, setYear] = useState(TODAY.getFullYear());

  const renderMonths = () => {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(
        <Grid key={`month-${i}`} item xs={3}>
          <Month month={i} year={year} />
        </Grid>
      );
    }

    return months;
  };

  return (
    <Paper square className={classes.root}>
      <Grid container>
        <Grid item>
          <Filter interventionColors={INTERVENTION_COLORS} />
        </Grid>
        <Grid item xs>
          <Grid container alignItems="center">
            <Button
              variant="outlined"
              onClick={() => {
                setYear(TODAY.getFullYear());
              }}
            >
              Today
            </Button>
            <IconButton onClick={() => setYear(year - 1)}>
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h6">{year}</Typography>
            <IconButton onClick={() => setYear(year + 1)}>
              <ArrowForwardIos />
            </IconButton>
          </Grid>
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
  );
};

Calendar.defaultProps = defaultProps;

export default Calendar;
