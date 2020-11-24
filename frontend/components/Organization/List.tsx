import React from "react";
import { List, ListItem } from "@material-ui/core";
import { IOrganization } from "@/index";

export interface OrganizationListProps {
  organizations?: IOrganization[];
  onChange?(organization: IOrganization): void;
}

const OrganizationList: React.FC<OrganizationListProps> = (props) => {
  return (
    <List>
      {props.organizations.map((o) => (
        <ListItem
          key={`li-${o.id}`}
          dense
          button
          onClick={() => props.onChange(o)}
        >
          {o.name}
        </ListItem>
      ))}
    </List>
  );
};

export default OrganizationList;
