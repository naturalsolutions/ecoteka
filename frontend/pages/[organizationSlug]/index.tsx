import { makeStyles, Container, Grid, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import { useAppContext } from "@/providers/AppContext";
import { NextPage } from "next";
import OrganizationMembers from "@/components/OrganizationV2/Members";
import OrganizationZones from "@/components/OrganizationV2/Zones";
import OrganizationProgress from "@/components/OrganizationV2/Progress";
import Loader from "@/components/Core/Feedback/OrganizationSkeleton";
import Error from "@/components/Core/Error";
import OrganizationSkeleton from "@/components/Core/Feedback/OrganizationSkeleton";
import { useRouter } from "next/router";
import Can from "@/components/Can";
import SpeciesDiversityDashboard from "@/components/OrganizationV2/Dashboards/SpeciesDiversityDashboard";
import GreeningDashboard from "@/components/OrganizationV2/Dashboards/GreeningDashboard";
import TreeHealthAssessmentDashboard from "@/components/OrganizationV2/Dashboards/TreeHealthAssessmentDashboard";
import UrbanForestryManagement from "@/components/OrganizationV2/Dashboards/UrbanForestryManagementDashboard";
import EconomyDashboard from "@/components/OrganizationV2/Dashboards/EconomyDashboard";
import DataQualityModule from "@/components/OrganizationV2/Modules/DataQualityModule";
import DetectTreesModule from "@/components/OrganizationV2/Modules/DetectTreesModules";

const useStyles = makeStyles(({ spacing }) => ({}));

const OrganizationMain = () => {
  const styles = useStyles();
  const { organization, isOrganizationLoading, organizationError } =
    useAppContext();
  const { t } = useTranslation(["common"]);
  return (
    <AbilityContext.Provider
      value={buildAbilityFor(
        organization?.current_user_role
          ? organization?.current_user_role
          : "none"
      )}
    >
      <Container>
        <Grid container direction="column">
          <Grid item>
            <OrganizationHeader />
          </Grid>
          <Grid item>
            <Box my={2} />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
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
    </AbilityContext.Provider>
  );
};

const OrganizationHomePage: NextPage = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    organization,
    isOrganizationLoading,
    isOrganizationSuccess,
    organizationError,
    fetchOrganization,
    user,
  } = useAppContext();
  const router = useRouter();

  const goToSignin = () => {
    const { organizationSlug } = router.query;
    router.push(`/signin?callbackUrl=${organizationSlug}`);
  };

  return (
    <AppLayoutGeneral isLoading={isOrganizationLoading} Skeleton={<Loader />}>
      {(() => {
        switch (true) {
          case organizationError && organizationError.status === 404:
            return (
              <Error
                errorCode={404}
                errorMessage="Organization not found"
                captionText="Organization not found"
                buttonText="Back to homepage"
              />
            );
          case organizationError &&
            organizationError.data.detail ===
              "Only authenticated members will be granted access to private organization. Please login first.":
            return (
              <Error
                errorCode={organizationError.status}
                errorMessage={organizationError.data.detail}
                captionText={organizationError.statusText}
                onClick={goToSignin}
                buttonText="Signin"
              />
            );
          case organizationError &&
            organizationError.data.detail ===
              "The user doesn't have enough privileges":
            return (
              <Error
                errorCode={organizationError.status}
                errorMessage={organizationError.data.detail}
                captionText={organizationError.statusText}
                buttonText="Back to homepage"
              />
            );
          case organization && isOrganizationSuccess:
            return <OrganizationMain />;
          default:
            return <OrganizationSkeleton />;
        }
      })()}
    </AppLayoutGeneral>
  );
};

export default OrganizationHomePage;
