import React from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Avatar,
} from "@material-ui/core";

export interface CardInfoPanelProps {
  title: string;
  content: string;
  icon?: any;
}

const defaultProps: CardInfoPanelProps = {
  title: "",
  content: "",
};

const useStyles = makeStyles(() => ({
  title: {
    fontSize: "1.4rem",
  },
}));

const CardInfoPanel: React.FC<CardInfoPanelProps> = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Card elevation={0}>
        <Typography className={classes.title}>{props.title}</Typography>
        <CardContent>
          <Grid container spacing={1} alignItems="center">
            {props.icon && (
              <Grid item>
                <Avatar>{props.icon}</Avatar>
              </Grid>
            )}
            <Grid item>
              <Typography>{props.content}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Divider />
    </React.Fragment>
  );
};

CardInfoPanel.defaultProps = defaultProps;

export default CardInfoPanel;
