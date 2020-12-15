import React, { useRef, Fragment } from "react";
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
  component?: React.ReactNode;
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
    color: theme.palette.text.hint,
    backgroundColor: "#ecedee",
  },
}));

const AnimatedGrid = animated(Grid);

const ETKWidget: React.FC<ETKWidgetProps> = ({
  gridProps,
  paperProps,
  springProps,
  children,
  component,
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
        <Fragment>
          {component}
          {children}
        </Fragment>
      </Paper>
    </AnimatedGrid>
  );
};

ETKWidget.defaultProps = defaultProps;

export default ETKWidget;
