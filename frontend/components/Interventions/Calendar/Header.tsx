import React from "react";
import {
  makeStyles,
  Grid,
  Button,
  IconButton,
  Typography,
} from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

export interface CalendarHeaderProps {
  year: number;
  onYearChange?(newYear: number): void;
}

const TODAY = new Date();

const defaultProps: CalendarHeaderProps = {
  year: TODAY.getFullYear(),
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const CalendarHeader: React.FC<CalendarHeaderProps> = (props) => {
  const classes = useStyles();

  return (
    <Grid container alignItems="center">
      <Button
        variant="outlined"
        onClick={() => {
          props.onYearChange(TODAY.getFullYear());
        }}
      >
        Today
      </Button>
      <IconButton
        size="medium"
        onClick={() => props.onYearChange(props.year - 1)}
      >
        <ArrowBackIos />
      </IconButton>
      <Typography variant="h6">{props.year}</Typography>
      <IconButton onClick={() => props.onYearChange(props.year + 1)}>
        <ArrowForwardIos />
      </IconButton>
    </Grid>
  );
};

CalendarHeader.defaultProps = defaultProps;

export default CalendarHeader;
