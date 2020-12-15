import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "@material-ui/core";
import { Header, Breadcrumb, Tabs } from "@/components/Organization";
import { apiRest } from "@/lib/api";
import AppLayoutGeneral from "@/components/appLayout/General";

interface OrganizationProps {}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [parents, setParents] = useState([]);

  const getData = async (id) => {
    try {
      const newOrganization = await apiRest.organization.get(id);
      const newParents = await apiRest.organization.parents(id);

      if (newOrganization) {
        setOrganization(newOrganization);
      }

      if (newParents && newParents.length > 0) {
        setParents(newParents);
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
        <Container>
          {parents && parents.length > 0 && <Breadcrumb path={parents} />}
          <Header />
          <Tabs organization={organization} activeTab={router.query.t} />
        </Container>
      </AppLayoutGeneral>
    )
  );
};

export default Organization;
