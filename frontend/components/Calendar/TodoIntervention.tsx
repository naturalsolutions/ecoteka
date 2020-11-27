import React from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/components/Calendar/ItemTypes";
import { TIntervention } from "@/components/Interventions/Schema";

export interface CalendarTodoInterventionProps {
  todoIntervention: TIntervention;
}

const defaultProps: CalendarTodoInterventionProps = {
  todoIntervention: undefined,
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const CalendarTodoIntervention: React.FC<CalendarTodoInterventionProps> = (
  props
) => {
  const [collectedProps, drag] = useDrag({
    item: { type: ItemTypes.BOX, id: props.todoIntervention.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Grid item>
      <Button ref={drag} size="small" color="primary" variant="contained">
        {props.todoIntervention.id}
      </Button>
    </Grid>
  );
};

CalendarTodoIntervention.defaultProps = defaultProps;

export default CalendarTodoIntervention;