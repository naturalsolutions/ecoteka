import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import TabPanel from '@material-ui/lab/TabPanel';
import { GeneralInfoTab } from "@/components/Organization/Tab/GeneralInfoTab";
import { TOrganization } from "@/pages/organization/[id]";


const useStyles = makeStyles({
  root: {
    flexGrow: 1,  
  },
});

interface TabsProps {
  organization: TOrganization
}

const ETKTabs: FC<TabsProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Informations Générales" value="0" />
        <Tab label="Équipes" value="1" />
        <Tab label="Membres" value="2" />
        <TabPanel value={value}>
          <GeneralInfoTab organization={props.organization} />
        </TabPanel>
        <TabPanel value={value}>
          Item Two
        </TabPanel>
        <TabPanel value={value}>
          Item Three
        </TabPanel>
      </Tabs>
    </Paper>
  );
};

export default ETKTabs;
