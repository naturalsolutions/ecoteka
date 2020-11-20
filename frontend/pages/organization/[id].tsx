import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRequireToken } from "@/lib/hooks/useRequireToken";
import { Box, Container } from "@material-ui/core";
import { Header, Breadcrumb, Tabs } from "@/components/Organization";
import { apiRest } from "@/lib/api";
import { useQuery } from "react-query";

export type TOrganization = {
  id?: number;
  name?: string;
  slug?: string;
  path?: string;
  config?: any;
  parent_id?: number;
};

interface OrganizationProps {}

function useOrganizationParents(id) {
  return useQuery(
    "organizationParents",
    async () => {
      const path = await apiRest.organization.parents(id);
      return path;
    },
    {
      enabled: Boolean(id), // We accept that id could not be 0
    }
  );
}

function useOrganization(id) {
  return useQuery(
    "organizationCurrentNode",
    async () => {
      const organization = await apiRest.organization.get(id);
      return organization;
    },
    {
      enabled: Boolean(id), // We accept that id could not be 0
    }
  );
}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const token = useRequireToken();
  const { data: path } = useOrganizationParents(router.query.id);
  const { status, data: organization, error, isFetching } = useOrganization(router.query.id);
  /* const {
    status: parentStatus,
    isLoading: parentsIsLoading,
    data: path,
    error: parentsError,
    isFetching: parentsIsFetching,
  } = useOrganizationParents(router.query.id); */

  console.log(path, organization);

  if (!token) {
    return <div>Récupération de votre session...</div>;
  }
  if (!path || !organization) {
    return <div>Récupération des données de l'organisation...</div>;
  }
  if (path.detail === "Signature has expired" || organization.detail === "Signature has expired") {
    router.push("/signin");
    return <div>Signature has expired...</div>;
  }
  return (
    <Container>
      {path && <Breadcrumb path={path} />}
      <Header />
      {/* <Tabs organization={[...(path || [])]?.pop()} /> */}
      <Tabs organization={organization} />
    </Container>
  );
};

export default Organization;
