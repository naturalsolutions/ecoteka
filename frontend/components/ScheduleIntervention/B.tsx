import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

interface ETKScheduleInterventionBProps {}

const useStyles = makeStyles(() => ({
  box: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

const ETKScheduleInterventionB: React.FC<ETKScheduleInterventionBProps> = (
  props
) => {
  const classes = useStyles();
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: function () {
      alert("aaaa");
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return <Box className={classes.box} ref={drop}></Box>;
};

export default ETKScheduleInterventionB;
