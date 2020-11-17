import React, { FC } from "react";
import { useRouter } from "next/router";

interface OrganizationProps {}

const Organization: FC<OrganizationProps> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  return <div>Organization: {id}</div>;
};

export default Organization;
