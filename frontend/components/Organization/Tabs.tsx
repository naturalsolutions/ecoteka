import React, { FC, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import { TabPanel, GeneralInfoTab } from "@/components/Organization";
import { Members } from "@/components/Organization/Members";
import { IOrganization } from "@/index.d";
import Teams from "./Teams/Teams";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

interface TabsProps {
  organization: IOrganization;
  activeTab: string | string[];
}

const ETKTabs: FC<TabsProps> = ({ organization, activeTab }) => {
  const { t } = useTranslation(["components", "common"]);
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
          <Tab
            label={t("components:Organization.Tabs.general")}
            value="general"
          />
          <Tab label={t("components:Organization.Tabs.teams")} value="teams" />
          <Tab
            label={t("components:Organization.Tabs.members")}
            value="members"
          />
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
