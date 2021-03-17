import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useApi from "@/lib/useApi";
import { IOrganization } from "@/index";
import { Button, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AxiosError } from "axios";
import FullPageSpinner from "@/components/Core/Feedback/FullPageSpinner";
import { formatDistance, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect } from "react";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { Row, Column, Item } from "@mui-treasury/components/flex";
import OrgChart from "@/components/OrganizationV2/OrgChart";
import MembersCard from "@/components/OrganizationV2/MembersCard";
import OrganizationHeader from "@/components/OrganizationV2/Header";
import Tutorials from "@/components/OrganizationV2/Tutorials";

const useStyles = makeStyles(() => ({
  avatar: {
    width: 64,
    height: 64,
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
    onError: (data) => {
      if (data?.response?.status == 404) {
        router.push("/404");
      }
    },
  });

  return (
    <AppLayoutGeneral>
      <Container>
        {isLoading && <FullPageSpinner />}
        {isError && (
          <Column>
            <Item grow mb={4}>
              <OrganizationHeader />
            </Item>
          </Column>
        )}
        {isSuccess && (
          <Column>
            <Item grow mb={4}>
              <OrganizationHeader />
            </Item>
            <Grid container spacing={4}>
              <Grid item xs={12} md={9}>
                <OrgChart />
              </Grid>
              <Grid item xs={12} md={3}>
                <MembersCard />
              </Grid>
            </Grid>
            <Tutorials />
          </Column>
        )}
      </Container>
    </AppLayoutGeneral>
  );
};

export default OrganizationHome;
