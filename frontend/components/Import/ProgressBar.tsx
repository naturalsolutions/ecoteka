import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface ETKProgressBarProps {
  linearProgressValue: number;
  message: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: ".5rem",
      marginBottom: ".5rem",
    },
  })
);

const ETKProgressBar: React.FC<ETKProgressBarProps> = (props) => {
  const classes = useStyle();
  let properties = {};

  return (
    <React.Fragment>
      <LinearProgress
        variant="determinate"
        value={props.linearProgressValue}
        {...properties}
        className={classes.root}
      />
      <em>{props.message}</em>
    </React.Fragment>
  );
};

ETKProgressBar.defaultProps = {};

export default ETKProgressBar;
