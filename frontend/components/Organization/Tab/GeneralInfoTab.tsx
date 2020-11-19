import { TOrganization } from "@/pages/organization/[id]";
import React, { FC } from "react";
import { Box } from "@material-ui/core";

interface IGeneralInfoTab {
  organization: TOrganization;
}

const GeneralInfoTab: FC<IGeneralInfoTab> = ({ organization }) => {
  return <Box>General Infos</Box>;
};

export default GeneralInfoTab;
