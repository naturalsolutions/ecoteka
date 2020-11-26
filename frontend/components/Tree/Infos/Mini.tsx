import React from "react";
import { makeStyles } from "@material-ui/core";

export interface ETKTreeInfosMiniProps {}

const defaultProps: ETKTreeInfosMiniProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKTreeInfosMini: React.FC<ETKTreeInfosMiniProps> = (props) => {
  const classes = useStyles();

  return <div>ETKTreeInfosMini</div>;
};

ETKTreeInfosMini.defaultProps = defaultProps;

export default ETKTreeInfosMini;
