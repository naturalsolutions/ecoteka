import { makeStyles, Container, Grid, Box } from "@material-ui/core";
import React from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import { useAppContext } from "@/providers/AppContext";
import { NextPage } from "next";
import OrganizationMembers from "@/components/OrganizationV2/Members";
import OrganizationZones from "@/components/OrganizationV2/Zones";
import OrganizationProgress from "@/components/OrganizationV2/Progress";
import TreeMetrics from "@/components/OrganizationV2/Dashboards/TreeMetrics";
import InterventionMetrics from "@/components/OrganizationV2/Dashboards/InterventionMetrics";
import OrganizationSkeleton from "@/components/Core/Feedback/OrganizationSkeleton";
import Can from "@/components/Can";
import SpeciesDiversityDashboard from "@/components/OrganizationV2/Dashboards/SpeciesDiversityDashboard";
import GreeningDashboard from "@/components/OrganizationV2/Dashboards/GreeningDashboard";
import TreeHealthAssessmentDashboard from "@/components/OrganizationV2/Dashboards/TreeHealthAssessmentDashboard";
import UrbanForestryManagement from "@/components/OrganizationV2/Dashboards/UrbanForestryManagementDashboard";
import EconomyDashboard from "@/components/OrganizationV2/Dashboards/EconomyDashboard";
import DataQualityModule from "@/components/OrganizationV2/Modules/DataQualityModule";
import DetectTreesModule from "@/components/OrganizationV2/Modules/DetectTreesModules";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  [theme.breakpoints.up("md")]: {
    root: {
      padding: theme.spacing(1),
    },
  },
}));

const OrganizationMain = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Grid container direction="column">
        <OrganizationHeader />
        <Grid item>
          <Grid container spacing={2}>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <TreeMetrics />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <InterventionMetrics />
              </Grid>
            </Can>
            <Can do="read" on="Members">
              <Grid item xs={12} md={6}>
                <OrganizationMembers />
              </Grid>
            </Can>
            <Can do="read" on="Teams">
              <Grid item xs={12} md={6}>
                <OrganizationZones />
              </Grid>
            </Can>
            <Grid item xs={12} md={6}>
              <OrganizationProgress />
            </Grid>
            <Grid item xs={12} md={6}>
              <GreeningDashboard />
            </Grid>
            <Grid item xs={12} md={12}>
              <SpeciesDiversityDashboard />
            </Grid>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <EconomyDashboard />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={12}>
                <TreeHealthAssessmentDashboard />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={12}>
                <UrbanForestryManagement />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <DataQualityModule />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <DetectTreesModule />
              </Grid>
            </Can>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const OrganizationHomePage: NextPage = () => {
  const { isOrganizationLoading, organizationError, organization } =
    useAppContext();
  return (
    <AppLayoutGeneral
      isLoading={isOrganizationLoading}
      error={organizationError}
      skeleton={<OrganizationSkeleton />}
    >
      {!isOrganizationLoading && !organizationError && organization && (
        <OrganizationMain />
      )}
    </AppLayoutGeneral>
  );
};

export default OrganizationHomePage;
