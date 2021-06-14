import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";

export interface MapTooltipItemProps {
  border: boolean;
}

const useStyles = makeStyles<Theme, MapTooltipItemProps>((theme: Theme) => ({
  root: {
    paddingBottom: "4px",
    borderBottom: ({ border }) => (border ? "1px solid #E0E0E0" : ""),
  },
}));

const MapTooltipItem: FC<MapTooltipItemProps> = ({
  border = true,
  children,
}) => {
  const classes = useStyles({ border });

  return <div className={classes.root}>{children}</div>;
};

export default MapTooltipItem;
