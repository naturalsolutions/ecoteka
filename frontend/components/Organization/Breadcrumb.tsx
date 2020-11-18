import React, { FC } from "react";
import { Breadcrumbs, Link, Box, Typography } from "@material-ui/core";
import { TOrganization } from "@/pages/organization/[id]";

interface BreadcrumbProps {
  path: TOrganization[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ path }) => {
  if (!path) {
    return null;
  }
  return (
    <Box m={1}>
      <Breadcrumbs>
        {path
          .sort((o1, o2) => (o1.path < o2.path ? -1 : o1.path === o2.path ? 0 : 1))
          .map((org, idx) => {
            return (
              <Link key={idx} color="inherit" href={`/organization/${org.id}`}>
                <Typography variant="subtitle1">{org.name}</Typography>
              </Link>
            );
          })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
