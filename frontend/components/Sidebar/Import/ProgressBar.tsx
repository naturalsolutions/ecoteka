import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

export interface ETKSidebarImportProgressBarProps {
  linearProgressValue: number;
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

const ETKSidebarImportProgressBar: React.FC<ETKSidebarImportProgressBarProps> = (
  props
) => {
  const classes = useStyle();
  let properties = {};

  return (
    <LinearProgress
      variant="determinate"
      value={props.linearProgressValue}
      {...properties}
      className={classes.root}
    />
  );
};

ETKSidebarImportProgressBar.defaultProps = {};

export default ETKSidebarImportProgressBar;
