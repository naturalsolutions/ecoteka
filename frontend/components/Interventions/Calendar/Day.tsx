import React from "react";
import { makeStyles, IconButton, Grid } from "@material-ui/core";
import { useTemplate } from "@/components/Template";
import { useDrop } from "react-dnd";
import { DragObjectWithType } from "react-dnd/lib/interfaces/hooksApi";
import { ItemTypes } from "@/components/Interventions/Calendar/ItemTypes";
import { apiRest } from "@/lib/api";
import { useAppContext } from "@/providers/AppContext";
import CalendarIntervention from "@/components/Interventions/Calendar/Intervention";
import { TIntervention } from "@/components/Interventions/Schema";

export interface CalendarDayProps {
  interventions: TIntervention[];
  day: number;
  month: number;
  year: number;
  onInterventionPlan?(intervention: TIntervention): void;
}

const defaultProps: CalendarDayProps = {
  interventions: [],
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
}));

interface InterventionType extends DragObjectWithType {
  id: number;
}

async function interventionPlan(
  organizationId: Number,
  interventionId: Number,
  date: CalendarDayProps
) {
  try {
    const dateIntervention = new Date(date.year, date.month, date.day + 1);
    const response = await apiRest.interventions.plan(
      organizationId,
      interventionId,
      dateIntervention
    );

    if (response.ok) {
      const intervention = await response.json();

      return intervention;
    }

    return false;
  } catch (e) {}
}

const CalendarDay: React.FC<CalendarDayProps> = (props) => {
  const classes = useStyles();
  const { theme } = useTemplate();
  const { user } = useAppContext();
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: async function (newIntervention: InterventionType) {
      const intervention = await interventionPlan(
        user.currentOrganization.id,
        newIntervention.id,
        props
      );

      props.onInterventionPlan(intervention);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const renderCalendarInterventions = () =>
    props.interventions.map((intervention) => {
      return (
        <Grid key={`day-intervention-${intervention.id}`} item>
          <CalendarIntervention intervention={intervention} />
        </Grid>
      );
    });

  return (
    <Grid container direction="column">
      <Grid item>
        <IconButton
          ref={drop}
          size="small"
          style={{
            backgroundColor: isToday(props.day, props.month, props.year)
              ? theme?.palette?.info.main
              : undefined,
          }}
        >
          {props.day}
        </IconButton>
      </Grid>
      <Grid item>
        <Grid container>{renderCalendarInterventions()}</Grid>
      </Grid>
    </Grid>
  );
};

CalendarDay.defaultProps = defaultProps;

export default CalendarDay;