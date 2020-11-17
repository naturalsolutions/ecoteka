import { TOrganization } from "@/pages/organization/[id]";
import React, { FC } from "react";

interface IGeneralInfoTab {
    organization: TOrganization
}

export const GeneralInfoTab : FC<IGeneralInfoTab> = ({organization}) => {
    return <React.Fragment></React.Fragment>;
}