import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRequireToken } from "@/lib/hooks/useRequireToken";
import { Box, Container } from "@material-ui/core";
import { Header, Breadcrumb, Tabs } from "@/components/Organization";
import { apiRest } from "@/lib/api";
import { useQuery } from "react-query";

export type TOrganization = {
  id: number;
  name: string;
  slug: string;
  path: string;
  config: any;
};

interface OrganizationProps {}

function useOrganizationParents(id) {
  return useQuery("organizationParents", async () => {
    const path = await apiRest.organization.parents(id);
    return path;
  }, {
    enabled: Boolean(id) // We accept that id could not be 0
  });
}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const token = useRequireToken();
  const { status, data:path, error, isFetching } = useOrganizationParents(router.query.id);
  /* const {
    status: parentStatus,
    isLoading: parentsIsLoading,
    data: path,
    error: parentsError,
    isFetching: parentsIsFetching,
  } = useOrganizationParents(router.query.id); */

  if (!token) {
    return <div>Récupération de votre session...</div>;
  }
  return (
    <Container maxWidth="md">
      {path && <Breadcrumb path={path} />}
      <Header />
      <Tabs organization={path?.pop()} />
    </Container>
  );
};

export default Organization;
