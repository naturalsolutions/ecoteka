import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useApi } from "@/lib/useApi";

export interface ETKSandboxProps {}

const defaultProps: ETKSandboxProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKSandbox: React.FC<ETKSandboxProps> = (props) => {
  const classes = useStyles();
  const api = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getUsers().then((response) => {
      console.log(response);
    });
  }, []);

  return <div>Sandbox</div>;
};

ETKSandbox.defaultProps = defaultProps;

export default ETKSandbox;
