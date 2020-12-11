import React from "react";
import { makeStyles, IconProps, Icon } from "@material-ui/core";

export interface ETKSimpleMetricProps {
  metric: string;
  caption: string;
  icon?: any;
}

const defaultProps: ETKSimpleMetricProps = {
  metric: "",
  caption: "",
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKSimpleMetric: React.FC<ETKSimpleMetricProps> = ({
  metric,
  caption,
  icon,
}) => {
  const classes = useStyles();

  return (
    <div>
      <div>{metric}</div>
      {icon}
      <div>{caption}</div>
    </div>
  );
};

ETKSimpleMetric.defaultProps = defaultProps;

export default ETKSimpleMetric;
