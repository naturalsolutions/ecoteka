import React from "react";
import { makeStyles, Grid } from "@material-ui/core";

export interface ETKImportPanelMappingProps {}

const defaultProps: ETKImportPanelMappingProps = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKImportPanelMapping: React.FC<ETKImportPanelMappingProps> = (props) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item>ssss</Grid>
    </Grid>
  );
};

ETKImportPanelMapping.defaultProps = defaultProps;

export default ETKImportPanelMapping;
