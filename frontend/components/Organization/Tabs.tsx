import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs as MUITabs, Tab } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

interface TabsProps {}

const Tabs: FC<TabsProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper className={classes.root}>
      <MUITabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Informations Générales" />
        <Tab label="Équipes" />
        <Tab label="Membres" />
      </MUITabs>
    </Paper>
  );
};

export default Tabs;
