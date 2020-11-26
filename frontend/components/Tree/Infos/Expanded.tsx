import React from "react";
import { makeStyles } from "@material-ui/core";

export interface ETKTreeInfosExpandedProps {}

const defaultProps: ETKTreeInfosExpandedProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosExpanded: React.FC<ETKTreeInfosExpandedProps> = (props) => {
  const classes = useStyles();

  return <div>ETKTreeInfosExpanded</div>;
};

ETKTreeInfosExpanded.defaultProps = defaultProps;

export default ETKTreeInfosExpanded;
