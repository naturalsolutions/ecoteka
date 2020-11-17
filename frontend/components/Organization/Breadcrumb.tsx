import React, { FC } from "react";
import { Breadcrumbs, Link, Box } from "@material-ui/core";

interface BreadcrumbProps {
  path: string[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ path }) => {
  if (!path) {
    return null;
  }
  return (
    <Box m={1}>
      <Breadcrumbs>
        {path.map((link, idx) => {
          return (
            <Link key={idx} color="inherit" href="/">
              {link}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
