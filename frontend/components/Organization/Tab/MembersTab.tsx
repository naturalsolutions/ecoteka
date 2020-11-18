import React, { FC } from "react";
import { Box } from "@material-ui/core";
import { TOrganization } from "@/pages/organization/[id]";

interface MembersTabProps {
  organization: TOrganization;
}

const MembersTab: FC<MembersTabProps> = (props) => {
  return (
    <Box m={1}>
      Members
      {props.organization.id}
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur voluptates harum explicabo dignissimos dolorum quidem ad, pariatur error
      accusantium, in minima sit recusandae voluptatibus odio. Molestias ipsum tenetur officiis fuga. Lorem ipsum dolor sit amet consectetur,
      adipisicing elit. A voluptatibus officiis culpa repellat dolor sequi nihil fuga ut voluptatum nostrum, quia illo aut autem accusamus placeat,
      voluptatem similique. Totam, ea! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur voluptates harum explicabo dignissimos
      dolorum quidem ad, pariatur error accusantium, in minima sit recusandae voluptatibus odio. Molestias ipsum tenetur officiis fuga. Lorem ipsum
      dolor sit amet consectetur, adipisicing elit. A voluptatibus officiis culpa repellat dolor sequi nihil fuga ut voluptatum nostrum, quia illo aut
      autem accusamus placeat, voluptatem similique. Totam, ea! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur voluptates harum
      explicabo dignissimos dolorum quidem ad, pariatur error accusantium, in minima sit recusandae voluptatibus odio. Molestias ipsum tenetur
      officiis fuga. Lorem ipsum dolor sit amet consectetur, adipisicing elit. A voluptatibus officiis culpa repellat dolor sequi nihil fuga ut
      voluptatum nostrum, quia illo aut autem accusamus placeat, voluptatem similique. Totam, ea! Lorem ipsum dolor sit amet consectetur adipisicing
      elit. Consectetur voluptates harum explicabo dignissimos dolorum quidem ad, pariatur error accusantium, in minima sit recusandae voluptatibus
      odio. Molestias ipsum tenetur officiis fuga. Lorem ipsum dolor sit amet consectetur, adipisicing elit. A voluptatibus officiis culpa repellat
      dolor sequi nihil fuga ut voluptatum nostrum, quia illo aut autem accusamus placeat, voluptatem similique. Totam, ea!
    </Box>
  );
};

export default MembersTab;
