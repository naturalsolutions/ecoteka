import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import { TabPanel, GeneralInfoTab } from "@/components/Organization";
import { Members } from "@/components/Organization/Members";
import { TOrganization } from "@/pages/organization/[id]";
import Teams from "./Teams/Teams";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

interface TabsProps {
  organization: TOrganization;
  activeTab: string;
}

const ETKTabs: FC<TabsProps> = ({ organization, activeTab }) => {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = useState(activeTab || "general");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(`/organization/${organization.id}?t=${newValue}`);
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
        <GeneralInfoTab organization={organization} />
      </TabPanel>
      <TabPanel value={value} index="teams">
        <Teams organization={organization} value={value} index="teams" />
      </TabPanel>
      <TabPanel value={value} index="members">
        <Members organization={organization} value={value} index="members" />
      </TabPanel>
    </>
  );
};

export default ETKTabs;
