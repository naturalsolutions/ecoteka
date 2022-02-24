import { makeStyles, Container, Grid } from "@material-ui/core";
import { useAppContext } from "@/providers/AppContext";
import { NextPage } from "next";
import Head from "next/head";
import AppLayoutGeneral from "@/components/AppLayout/General";
import OrganizationHeader from "@/components/OrganizationV2/Header";
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

const OrganizationHomePage: NextPage = () => {
  const { isOrganizationLoading, organizationError, organization } =
    useAppContext();
  const year = new Date().getFullYear();
  const classes = useStyles();

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
        <Container
          data-test="page-organizationSlug-index"
          className={classes.root}
        >
          <Grid container direction="column">
            <OrganizationHeader />
            <Grid item container spacing={2} className={classes.itemsContainer}>
              <Can do="read" on="Dashboard">
                <Grid item xs={12} md={6}>
                  <TreeMetrics />
                </Grid>
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
                <Grid item xs={12} md={12}>
                  <TreeHealthAssessmentDashboard />
                </Grid>
              </Can>
              <Can do="read" on="Dashboard">
                <Grid item xs={12} md={12}>
                  <UrbanForestryManagement />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DataQualityModule />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetectTreesModule />
                </Grid>
              </Can>
            </Grid>
          </Grid>
        </Container>
      )}
    </AppLayoutGeneral>
  );
};

export default OrganizationHomePage;
