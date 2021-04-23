import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import React from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import TutorialsGallery from "@/components/OrganizationV2/Tutorials";
import Can from "@/components/Can";
import { Alert } from "@material-ui/lab";
import { useAppContext } from "@/providers/AppContext";
import { NextPage } from "next";

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

const OrganizationHomePage: NextPage = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { organization } = useAppContext();

  return (
    <AppLayoutGeneral>
      <AbilityContext.Provider
        value={buildAbilityFor(organization?.current_user_role)}
      >
        <Container>
          {organization && (
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
                  {organization.name} {t("components.Organization.insights")}
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

export default OrganizationHomePage;
