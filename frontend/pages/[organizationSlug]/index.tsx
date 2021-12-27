import { makeStyles, Container, Grid } from "@material-ui/core";
import Head from "next/head";
import { useState, useEffect } from "react";
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
import useMetricsByYear from "@/lib/hooks/useMetricsByYear";
import useMetricsTrees from "@/lib/hooks/useMetricsTrees";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
  itemsContainer: {
    overflow: "hidden",
  },
  [theme.breakpoints.up("md")]: {
    root: {
      padding: theme.spacing(1),
    },
    itemsContainer: {
      overflow: "unset",
    },
  },
}));

const OrganizationMain = () => {
  const year = new Date().getFullYear();
  const classes = useStyles();
  const { organization } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [metricByYear, setMetricsbyYear] = useState();
  const fetchMetricsYear = useMetricsByYear(organization.id, year);
  const [metricTrees, setMetricsTrees] = useState();
  const fetchMetricsTrees = useMetricsTrees(organization.id);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMetricsYear(), fetchMetricsTrees()]).then(
      (Allmetrics) => {
        setLoading(false);
        setMetricsbyYear(Allmetrics[0]);
        setMetricsTrees(Allmetrics[1]);
      }
    );
  }, []);

  return (
    <Container className={classes.root}>
      <Grid container direction="column">
        <OrganizationHeader />
        <Grid item className={classes.itemsContainer}>
          <Grid container spacing={2}>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <TreeMetrics
                  year={year}
                  loading={loading}
                  metrics={metricByYear}
                />
              </Grid>
            </Can>
            <Can do="read" on="Dashboard">
              <Grid item xs={12} md={6}>
                <InterventionMetrics
                  year={year}
                  loading={loading}
                  metrics={metricByYear}
                />
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
              <OrganizationProgress metrics={metricTrees} loading={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GreeningDashboard />
            </Grid>
            <Grid item xs={12} md={12}>
              <SpeciesDiversityDashboard
                metrics={metricTrees}
                loading={loading}
              />
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
      <Head>
        <title>ecoTeka · {organization?.name}</title>
      </Head>
      {!isOrganizationLoading && !organizationError && organization && (
        <OrganizationMain />
      )}
    </AppLayoutGeneral>
  );
};

export default OrganizationHomePage;
