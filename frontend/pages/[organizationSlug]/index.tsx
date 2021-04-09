import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index";
import { Box, Button, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AxiosError } from "axios";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import { subject } from "@casl/ability";
import React, { useEffect } from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import OrgChart from "@/components/OrganizationV2/OrgChart";
import MembersCard from "@/components/OrganizationV2/MembersCard";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import TutorialsGallery from "@/components/OrganizationV2/Tutorials";
import Can from "@/components/Can";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(({ spacing }) => ({
  avatar: {
    width: 64,
    height: 64,
  },
  tutorialsSection: {
    minHeight: "300px",
  },
  subtitle: {
    marginTop: spacing(3),
    marginBottom: spacing(1),
  },
}));

const OrganizationHome = () => {
  const styles = useStyles();
  const router = useRouter();
  const { organizationSlug } = router.query;
  const { apiETK } = useApi().api;
  const { t } = useTranslation(["common"]);
  const fetchOrga = async () => {
    const { data } = await apiETK.get(
      `/organization/${organizationSlug}?mode=by_slug`
    );
    return data;
  };

  const { isLoading, isSuccess, isError, data: organizationData } = useQuery<
    IOrganization,
    AxiosError
  >([`orga`, organizationSlug], fetchOrga, {
    enabled: !!organizationSlug,
    onSuccess: (data) => {
      subject("Organization", data);
    },
    onError: (data) => {
      if (data?.response?.status == 404) {
        router.push("/404");
      }
      if (data?.response?.status == 403) {
        router.push("/");
      }
    },
  });

  return (
    <AppLayoutGeneral>
      <AbilityContext.Provider
        value={buildAbilityFor(organizationData?.current_user_role)}
      >
        <Container>
          {isLoading && <FullPageSpinner />}
          {isError && <FullPageSpinner />}
          {isSuccess && (
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="stretch"
              spacing={4}
            >
              <Grid item xs={12}>
                <OrganizationHeader />
              </Grid>
              <Grid container item spacing={4}>
                <Can do="read" on="Teams">
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      component="h2"
                      className={styles.subtitle}
                    >
                      {t("components.Organization.zones").toUpperCase()}
                    </Typography>
                    <Alert severity="warning">Work in progress</Alert>
                  </Grid>
                </Can>
                <Can do="read" on="Members">
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      component="h2"
                      className={styles.subtitle}
                    >
                      {t("components.Organization.members").toUpperCase()}
                    </Typography>
                    <Alert severity="warning">Work in progress</Alert>
                  </Grid>
                </Can>
              </Grid>
              <Box className={styles.tutorialsSection} pb={8}>
                <Typography
                  variant="h4"
                  component="h2"
                  className={styles.subtitle}
                >
                  {organizationData.name}{" "}
                  {t("components.Organization.insights")}
                </Typography>
              </Box>
              <Box className={styles.tutorialsSection} pb={8}>
                <Typography
                  variant="h4"
                  component="h2"
                  className={styles.subtitle}
                >
                  {t("common.tutorials")}
                </Typography>
                <TutorialsGallery />
              </Box>
            </Grid>
          )}
        </Container>
      </AbilityContext.Provider>
    </AppLayoutGeneral>
  );
};

export default OrganizationHome;
