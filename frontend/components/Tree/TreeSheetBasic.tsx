import { apiRest } from "@/lib/api";
import { Typography } from "@material-ui/core";
import { FC, Fragment } from "react";
import { useQuery } from "react-query";
import RoomIcon from "@material-ui/icons/Room";
import InterventionsTable from "../Interventions/InterventionsTable";

const TreeSheetBasic: FC<{
  id: number;
}> = (props) => {
  const id = props.id;
  const { data: tree } = useQuery(
    `tree_${id}`,
    async () => {
      const data = await apiRest.trees.get(id);
      return data;
    },
    {
      enabled: Boolean(id),
    }
  );
  const { data: interventions } = useQuery(
    `tree_${id}_interventions`,
    async () => {
      const data = await apiRest.trees.getInterventions(id);
      return data;
    },
    {
      enabled: Boolean(id),
    }
  );
  return (
    <Fragment>
      <Typography color="textPrimary" component="h3">
        {tree?.family}
      </Typography>
      <Typography color="textPrimary" component="b">
        <RoomIcon />
        {tree?.address}
      </Typography>
      {interventions && <InterventionsTable interventions={interventions} />}
    </Fragment>
  );
};

export default TreeSheetBasic;
