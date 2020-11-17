import React, { FC } from "react";
import { useRouter } from "next/router";
import { useRequireToken } from "@/lib/hooks/useRequireToken";
import { Box, Container } from "@material-ui/core";
import { Header, Breadcrumb } from "@/components/Organization";

interface OrganizationProps {}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const token = useRequireToken();
  const { id } = router.query;
  const path = ["Materialized", "Path"];
  console.log(token);
  if (!token) {
    return <div>Récupération de votre session...</div>;
  }
  return (
    <Container maxWidth="md">
      <Breadcrumb path={path} />
      <Header />
    </Container>
  );
};

export default Organization;
