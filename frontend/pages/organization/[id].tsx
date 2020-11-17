import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRequireToken } from "@/lib/hooks/useRequireToken";
import { Box, Container } from "@material-ui/core";
import { Header, Breadcrumb, Tabs } from "@/components/Organization";
import { apiRest } from "@/lib/api"
import { useQuery } from "react-query";

export type TOrganization = {
  id: number;
  name: string;
  slug: string;
  path: string;
  config: any;
}

interface OrganizationProps {}

function useOrganizationParents(query) {
  return useQuery("organizationParents", async () => {
    if (!query) {
      return [];
    }
    const path = await apiRest.organization.parents(query);
    return path;
  });
}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const token = useRequireToken();
  const { status: parentStatus , isLoading: parentsIsLoading, data: path, error: parentsError, isFetching: parentsIsFetching  } = useOrganizationParents(router.query.id);

  if (!token) {
    return <div>Récupération de votre session...</div>;
  }
  return (
    <Container maxWidth="md">
      {path && <Breadcrumb path={path} />}
      <Header />
      <Tabs organization={!path ? null : path.splice(-1)} />
    </Container>
  );
};

export default Organization;
