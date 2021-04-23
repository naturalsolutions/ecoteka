import { makeStyles, Container, Grid, Box } from "@material-ui/core";
import React from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import { useAppContext } from "@/providers/AppContext";
import { NextPage } from "next";
import OrganizationMembers from "@/components/OrganizationV2/Members";
import OrganizationProgress from "@/components/OrganizationV2/Progress";

const useStyles = makeStyles(({ spacing }) => ({}));

const OrganizationHomePage: NextPage = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { organization } = useAppContext();

  return (
    <AppLayoutGeneral>
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
              <Grid item xs={12} md={6}>
                <OrganizationProgress />
              </Grid>
              <Grid item xs={12} md={6}>
                <OrganizationMembers />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppLayoutGeneral>
  );
};

export default OrganizationHomePage;
