import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { TOrganization } from "@/pages/organization/[id]";

interface TeamsTabProps {
  organization: TOrganization
}

const TeamsTab: FC<TeamsTabProps> = (props) => {

  return (
    <Box m={1}>
        TeamsTab
        {props.organization.id}
    </Box>
  );
};

export default TeamsTab;