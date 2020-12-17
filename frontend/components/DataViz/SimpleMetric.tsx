import React from "react";
import {
  makeStyles,
  IconProps,
  Icon,
  Box,
  Typography,
} from "@material-ui/core";

export interface ETKSimpleMetricProps {
  metric: number;
  caption: string;
  icon?: any;
}

const defaultProps: ETKSimpleMetricProps = {
  metric: 0,
  caption: "",
};

const useStyles = makeStyles(() => ({
  root: {},
  metric: {
    fontWeight: "bold",
    fontSize: "2rem",
  },
  caption: {
    color: "#707274",
    fontSize: "1rem",
    fontWeight: "bolder",
  },
}));

const ETKSimpleMetric: React.FC<ETKSimpleMetricProps> = ({
  metric,
  caption,
  icon,
}) => {
  const classes = useStyles();

  return (
    <Box>
      <Box pb={1}>
        <Typography variant="h6" component="h2" className={classes.metric}>
          {metric}
        </Typography>
      </Box>
      {icon}
      <Box pt={1} className={classes.caption}>
        {caption}
      </Box>
    </Box>
  );
};

ETKSimpleMetric.defaultProps = defaultProps;

export default ETKSimpleMetric;
