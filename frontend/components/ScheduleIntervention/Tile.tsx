import React from "react";
import { makeStyles } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { DragObjectWithType } from "react-dnd/lib/interfaces/hooksApi";
import { ItemTypes } from "./ItemTypes";
import { apiRest } from "@/lib/api";

interface ETKScheduleInterventionTileProps {
  date: string;
  item: any;
  onInterventionPlanified?(intervention: object, month: number): void;
}

const useStyles = makeStyles(() => ({
  box: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

interface InterventionType extends DragObjectWithType {
  id: number;
};

const ETKScheduleInterventionTile: React.FC<ETKScheduleInterventionTileProps> = (
  props
) => {
  const classes = useStyles();
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: async function (newItem: InterventionType) {
      try {
        const response = await apiRest.interventions.plan(
          newItem.id,
          props.date
        );

        if (response.ok) {
          const internention = await response.json();
          const date = new Date(props.date);
          props.onInterventionPlanified(internention, date.getMonth());
        }
      } catch (e) {}
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div className={classes.box} ref={drop}>
      {props.item && (
        <div
          key={`tile-content-${props.item.id}`}
          style={{
            backgroundColor: "black",
            width: "5px",
            height: "5px",
            margin: "0 2px 2px 0",
            borderRadius: props.item.done ? "50%" : "unset",
          }}
        />
      )}
    </div>
  );
};

export default ETKScheduleInterventionTile;
