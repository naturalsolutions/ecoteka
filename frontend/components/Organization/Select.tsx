import React from "react";
import { Button, MenuItem, Menu } from "@material-ui/core";
import { IOrganization, IUser } from "@/index";

export interface OrganizationSelectProps {
  user?: IUser;
  onChange?(organization: IOrganization): void;
}

const defaultProps: OrganizationSelectProps = {};

const OrganizationSelect: React.FC<OrganizationSelectProps> = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (o) => {
    setAnchorEl(null);

    if (o) {
      props.onChange(o);
    }
  };

  return (
    <>
      <Button aria-haspopup="true" onClick={handleClick}>
        {props.user.currentOrganization
          ? props.user.currentOrganization.name
          : ""}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.user.organizations.map((o) => (
          <MenuItem key={`mi-${o.id}`} onClick={() => handleClose(o)}>
            {o.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

OrganizationSelect.defaultProps = defaultProps;

export default OrganizationSelect;
