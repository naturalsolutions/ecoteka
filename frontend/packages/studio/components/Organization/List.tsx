import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { IOrganization } from "@/index";

export interface OrganizationListProps {
  organizations?: IOrganization[];
  onChange?(organization: IOrganization): void;
}

const OrganizationList: React.FC<OrganizationListProps> = (props) => {
  return (
    <List>
      {props.organizations.map((o) => (
        <ListItem key={`li-${o.id}`} button onClick={() => props.onChange(o)}>
          <ListItemText>{o.name}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default OrganizationList;
