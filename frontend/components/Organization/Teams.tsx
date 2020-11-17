import { FC } from "react";
import { TOrganization } from "@/pages/organization/[id]";
import { useQuery } from "react-query";
import { apiRest } from "@/lib/api"

interface TeamsProps {
  organization: TOrganization;
}

function useTeams(id) {
    return useQuery("teams", async () => {
      if (!id) {
        return [];
      }
      const path = await apiRest.organization.teams(id);
      return path;
    });
  }

const Teams: FC<TeamsProps> = (props) => {
  return (
    <div>teams</div>
  );
};

export default Teams;