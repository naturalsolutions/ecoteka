import React, { useEffect } from "react";
import {
  Button,
  MenuItem,
  Menu,
  Box,
  IconButton,
  Hidden,
} from "@material-ui/core";
import { IOrganization, IUser } from "@/index";
import { useRouter } from "next/router";
import LocationCityIcon from "@material-ui/icons/LocationCity";

export interface OrganizationSelectProps {
  user?: IUser;
  onChange?(organization: IOrganization): void;
}

const defaultProps: OrganizationSelectProps = {};

const OrganizationSelect: React.FC<OrganizationSelectProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [organization, setOrganization] = React.useState<IOrganization>();
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (o) => {
    setAnchorEl(null);

    if (o) {
      props.onChange(o);
    }

    if (router.route === "/organization/[id]") {
      router.push(`/organization/${o.id}`);
    }
  };

  useEffect(() => {
    if (props.user) {
      setOrganization(props.user.currentOrganization);
    }
  }, [props.user]);

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
        {props.user?.organizations
          .filter((o) => !o.archived)
          .map((o) => (
            <MenuItem key={`mi-${o.id}`} onClick={() => handleClose(o)}>
              {o.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

OrganizationSelect.defaultProps = defaultProps;

export default OrganizationSelect;
