import { FC } from "react";
import { makeStyles, Paper, Theme, Button } from "@material-ui/core";
import Item from "@/components/Map/Tooltip/Item";

export interface MapTooltipProps {
  x: number;
  y: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
    background: "rgba(255, 255, 255, .8)",
  },
  content: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
}));

const MapTooltip: FC<MapTooltipProps> = ({ x, y, children }) => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.root}
      style={{
        left: x,
        top: y,
      }}
    >
      <div className={classes.content}>{children}</div>
    </Paper>
  );
};

export default MapTooltip;
