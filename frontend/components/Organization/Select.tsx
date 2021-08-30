import React, { useEffect, useState, FC } from "react";
import {
  Button,
  MenuItem,
  Menu,
  Box,
  IconButton,
  Hidden,
} from "@material-ui/core";
import { IOrganization } from "@/index";
import { useRouter } from "next/router";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { useAppContext } from "@/providers/AppContext";

const OrganizationSelect: FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { user, organization, setOrganization } = useAppContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newOrganization: IOrganization) => {
    setAnchorEl(null);

    if (!newOrganization?.slug) {
      return;
    }

    setOrganization(newOrganization);

    if (router.route === "/[organizationSlug]/map") {
      router.push({
        pathname: "/[organizationSlug]/map",
        query: {
          organizationSlug: newOrganization.slug,
        },
      });
    }
  };

  return (
    <Box ml={2} mr={3}>
      <Hidden smDown>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {organization?.name}
        </Button>
      </Hidden>
      <Hidden mdUp>
        <IconButton onClick={handleClick}>
          <LocationCityIcon />
        </IconButton>
      </Hidden>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user?.organizations
          .filter((organization) => !organization.archived)
          .map((organization) => (
            <MenuItem
              key={`mi-${organization.id}`}
              onClick={() => handleClose(organization)}
            >
              {organization.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default OrganizationSelect;
