import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import { TabPanel, GeneralInfoTab, MembersTab } from "@/components/Organization";
import { TOrganization } from "@/pages/organization/[id]";
import Teams from "./Teams";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

interface TabsProps {
  organization: TOrganization;
}

const ETKTabs: FC<TabsProps> = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState("general");

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
    <>
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          scrollButtons="on"
          aria-label="organization tabs"
        >
          <Tab label="Informations Générales" value="general" />
          <Tab label="Équipes" value="teams" />
          <Tab label="Membres" value="members" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index="general">
        <GeneralInfoTab organization={props.organization} />
      </TabPanel>
      <TabPanel value={value} index="teams">
        <Teams organization={props.organization} value={value} index="teams" />
      </TabPanel>
      <TabPanel value={value} index="members">
        <MembersTab organization={props.organization} />
      </TabPanel>
    </>
  );
};

export default ETKTabs;
