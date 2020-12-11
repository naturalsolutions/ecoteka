import React, { useRef } from "react";
import {
  Grid,
  makeStyles,
  Paper,
  GridProps,
  PaperProps,
} from "@material-ui/core";
import { animated, useSpring } from "react-spring";

export interface ETKWidgetProps {
  gridProps?: GridProps;
  paperProps?: PaperProps;
  springProps?: any;
  children?: React.ReactNode;
}

const defaultProps: ETKWidgetProps = {
  gridProps: {
    item: true,
    xs: 4,
  },
  paperProps: {},
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const AnimatedGrid = animated(Grid);

const ETKWidget: React.FC<ETKWidgetProps> = ({
  gridProps,
  paperProps,
  springProps,
  children,
}) => {
  const classes = useStyles();
  const _springProps = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(0%, -8%, 0px)",
    },
    to: {
      opacity: 1,
      transform: "translate3d(0%, 0%, 0px)",
    },
    config: {
      mass: 1,
    },
  });

  return (
    <AnimatedGrid {...gridProps} style={springProps}>
      <Paper {...paperProps} className={classes.paper}>
        {children}
      </Paper>
    </AnimatedGrid>
  );
};

ETKWidget.defaultProps = defaultProps;

export default ETKWidget;
