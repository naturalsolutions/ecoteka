import React from "react";
import { makeStyles, Card, Typography, Grid } from "@material-ui/core";

export interface ETKCardInfoPanelProps {
  title: string;
  content: string;
  iconContent?: any;
}

const defaultProps: ETKCardInfoPanelProps = {
  title: "",
  content: "",
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const ETKCardInfoPanel: React.FC<ETKCardInfoPanelProps> = (props) => {
  const classes = useStyles();

  return (
    <Card elevation={0}>
      <Typography variant="h5">{props.title}</Typography>
      <Grid container>
        <Grid item>{props.iconContent}</Grid>
        <Grid item>
          <Typography>{props.content}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

ETKCardInfoPanel.defaultProps = defaultProps;

export default ETKCardInfoPanel;
