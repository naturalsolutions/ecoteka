import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";

export interface TooltipKeyValueProps {
  property: string;
  value: string | number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  property: {
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
}));

const TooltipKeyValue: FC<TooltipKeyValueProps> = ({ property, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.property}>{property}</div>
      <div className={classes.value}>{value}</div>
    </div>
  );
};

export default TooltipKeyValue;
