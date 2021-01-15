import React, { useEffect } from "react";
import { Button, MenuItem, Menu, Box } from "@material-ui/core";
import { IOrganization, IUser } from "@/index";
import { useRouter } from "next/router";

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
      <Button
        size="small"
        variant="outlined"
        color="primary"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {organization?.name}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.user?.organizations.map((o) => (
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
