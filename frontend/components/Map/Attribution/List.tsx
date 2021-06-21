import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";

export interface MapAttributionListProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    left: 0,
    bottom: 0,
    display: "flex",
    gap: "5px",
    background: "rgba(255, 255, 255, 0.5)",
    padding: "0 5px",
  },
}));

const MapAttributionList: FC<MapAttributionListProps> = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

export default MapAttributionList;
