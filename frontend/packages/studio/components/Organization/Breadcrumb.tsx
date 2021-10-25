import React, { FC } from "react";
import { Breadcrumbs, Link, Box, Typography } from "@material-ui/core";
import { IOrganization } from "@/index.d";
import { useRouter } from "next/router";

interface BreadcrumbProps {
  path: IOrganization[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ path }) => {
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/organization/${id}`);
  };

  return (
    path && (
      <Box pt={4}>
        <Breadcrumbs>
          {path
            .sort((o1, o2) =>
              o1.path < o2.path ? -1 : o1.path === o2.path ? 0 : 1
            )
            .map((organization) => {
              return (
                <Link
                  key={organization.id}
                  onClick={() => handleClick(organization.id)}
                  color="inherit"
                >
                  <Typography variant="subtitle1">
                    {organization.name}
                  </Typography>
                </Link>
              );
            })}
        </Breadcrumbs>
      </Box>
    )
  );
};

export default Breadcrumb;
