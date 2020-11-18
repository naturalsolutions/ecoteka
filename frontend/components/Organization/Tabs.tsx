import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import { GeneralInfoTab } from "@/components/Organization/Tab/GeneralInfoTab";
import { TOrganization } from "@/pages/organization/[id]";
import Teams from "./Teams";


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

interface TabsProps {
  organization: TOrganization
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

const ETKTabs: FC<TabsProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Informations Générales" />
        <Tab label="Équipes" />
        <Tab label="Membres" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <GeneralInfoTab organization={props.organization} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Teams organization={props.organization} value={value} index={1} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Paper>
  );
};

export default ETKTabs;
