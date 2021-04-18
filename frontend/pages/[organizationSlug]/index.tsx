import { FC } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useApi from "@/lib/useApi";
import { IOrganization, IUser } from "@/index";
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
import { useAppContext } from "@/providers/AppContext";
import CoreError from "@/components/Core/Error";

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

const OrganizationAuthorizedPage = () => {
  const styles = useStyles();
  const { organization, isOrganizationLoading } = useAppContext();
  const { t } = useTranslation(["common"]);
  return (
    <AbilityContext.Provider
      value={buildAbilityFor(organization?.current_user_role)}
    >
      <Container>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <OrganizationHeader
              organization={organization}
              isOrganizationLoading={isOrganizationLoading}
            />
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
            <Typography variant="h4" component="h2" className={styles.subtitle}>
              {organization.name} {t("components.Organization.insights")}
            </Typography>
          </Box>
          <Box className={styles.tutorialsSection} pb={8}>
            <Typography variant="h4" component="h2" className={styles.subtitle}>
              {t("common.tutorials")}
            </Typography>
            <TutorialsGallery />
          </Box>
        </Grid>
      </Container>
    </AbilityContext.Provider>
  );
};

const OrganizationHome = () => {
  const router = useRouter();
  const {
    organization,
    isOrganizationLoading,
    isOrganizationSuccess,
    user,
  } = useAppContext();
  const { t } = useTranslation(["common"]);

  return (
    <AppLayoutGeneral
      isLoading={isOrganizationLoading}
      skeleton={<FullPageSpinner />}
    >
      {(() => {
        switch (true) {
          // TODO : Error code and message should be send from AppContext
          // ! On 403 error if visitor is not authenticated, one's shouold be redirected to Signin
          // ! On 403 error if user is  authenticated, Unauthorized component soould be displayed
          // @javi.ns : sorry i didn't have to more explicit code; maybe it will be clearer if we write a fn
          // for each case
          case organization && !isOrganizationSuccess:
            return (
              <CoreError
                errorCode={404}
                captionText="Error"
                buttonText="button"
              />
            );
          case !organization && !isOrganizationSuccess:
            return (
              <CoreError
                errorCode={404}
                captionText="Error"
                buttonText="button"
              />
            );
          case organization && isOrganizationSuccess:
            return <OrganizationAuthorizedPage />;
          default:
            return <FullPageSpinner />;
        }
      })()}
    </AppLayoutGeneral>
  );

  // return !organization ? (
  //   <CoreError errorCode={404} captionText="Error" buttonText="button" />
  // ) : (
  //   <AppLayoutGeneral
  //     isLoading={isOrganizationLoading}
  //     skeleton={<FullPageSpinner />}
  //   >
  //     <AbilityContext.Provider
  //       value={buildAbilityFor(organization?.current_user_role)}
  //     >
  //       <Container>
  //         <Grid
  //           container
  //           direction="column"
  //           justify="flex-start"
  //           alignItems="stretch"
  //           spacing={4}
  //         >
  //           <Grid item xs={12}>
  //             <OrganizationHeader
  //               organization={organization}
  //               isOrganizationLoading={isOrganizationLoading}
  //             />
  //           </Grid>
  //           <Grid container item spacing={4}>
  //             <Can do="read" on="Teams">
  //               <Grid item xs={12} md={6}>
  //                 <Typography
  //                   variant="h6"
  //                   component="h2"
  //                   className={styles.subtitle}
  //                 >
  //                   {t("components.Organization.zones").toUpperCase()}
  //                 </Typography>
  //                 <Alert severity="warning">Work in progress</Alert>
  //               </Grid>
  //             </Can>
  //             <Can do="read" on="Members">
  //               <Grid item xs={12} md={6}>
  //                 <Typography
  //                   variant="h6"
  //                   component="h2"
  //                   className={styles.subtitle}
  //                 >
  //                   {t("components.Organization.members").toUpperCase()}
  //                 </Typography>
  //                 <Alert severity="warning">Work in progress</Alert>
  //               </Grid>
  //             </Can>
  //           </Grid>
  //           <Box className={styles.tutorialsSection} pb={8}>
  //             <Typography
  //               variant="h4"
  //               component="h2"
  //               className={styles.subtitle}
  //             >
  //               {organization.name} {t("components.Organization.insights")}
  //             </Typography>
  //           </Box>
  //           <Box className={styles.tutorialsSection} pb={8}>
  //             <Typography
  //               variant="h4"
  //               component="h2"
  //               className={styles.subtitle}
  //             >
  //               {t("common.tutorials")}
  //             </Typography>
  //             <TutorialsGallery />
  //           </Box>
  //         </Grid>
  //       </Container>
  //     </AbilityContext.Provider>
  //   </AppLayoutGeneral>
  // );
};

export default OrganizationHome;
