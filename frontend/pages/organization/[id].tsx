import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@material-ui/core";
import { Header, Breadcrumb, Tabs } from "@/components/Organization";
import useAPI from "@/lib/useApi";
import { AbilityContext } from "@/components/Can";
import { buildAbilityFor } from "@/abilities/genericOrganizationAbility";
import AppLayoutGeneral from "@/components/AppLayout/General";

interface OrganizationProps {}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const { api } = useAPI();
  const { apiETK } = api;
  const [organization, setOrganization] = useState(null);
  const [parents, setParents] = useState([]);

  const getData = async (id) => {
    try {
      const {
        data: organizationData,
        status: organizationResponseStatus,
      } = await apiETK.get(`/organization/${id}`);
      const {
        data: parentsData,
        status: parentsResponseStatus,
      } = await apiETK.get(`/organization/${id}/path`);

      if (organizationResponseStatus === 200) {
        setOrganization(organizationData);
      }

      if (parentsResponseStatus === 200 && parentsData.length > 0) {
        setParents(parentsData);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (router.query.id) {
      getData(router.query.id);
    }
  }, [router.query.id]);

  return (
    organization && (
      <AppLayoutGeneral>
        <AbilityContext.Provider
          value={buildAbilityFor(organization?.current_user_role)}
        >
          <Container>
            {parents && parents.length > 0 && <Breadcrumb path={parents} />}
            <Header />
            <Tabs organization={organization} activeTab={router.query.t} />
          </Container>
        </AbilityContext.Provider>
      </AppLayoutGeneral>
    )
  );
};

export default Organization;
