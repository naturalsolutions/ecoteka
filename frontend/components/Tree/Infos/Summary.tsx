import { apiRest } from "@/lib/api";
import { Button, Typography, Grid } from "@material-ui/core";
import { FC, useState, useEffect } from "react";
import RoomIcon from "@material-ui/icons/Room";
import InterventionsTable from "../../Interventions/InterventionsTable";
import { useAppContext } from "@/providers/AppContext";
import TreeExpanded from "@/components/Tree/Infos/Expanded";
import { useTemplate } from "@/components/Template";
import { TIntervention } from "@/components/Interventions/Schema";

const Summary: FC<{ id: number }> = ({ id }) => {
  const { user } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tree, setTree] = useState<any>({});
  const [interventions, setInterventions] = useState<TIntervention[]>();
  const { dialog } = useTemplate();

  const getTree = async (id) => {
    const organizationId = user.currentOrganization.id;
    const newTree = await apiRest.trees.get(organizationId, id);
    const newInterventions = await apiRest.trees.getInterventions(
      organizationId,
      id
    );

    setTree(newTree);
    setInterventions(newInterventions);
  };

  useEffect(() => {
    if (id) {
      getTree(id);
    }
  }, [id]);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography color="textPrimary" component="h3">
          {tree && tree?.family}
        </Typography>
      </Grid>
      <Grid item>
        {interventions && (
          <InterventionsTable interventions={interventions} tree={tree} />
        )}
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsExpanded(true)}
            >
              Plus de détails
            </Button>
          </Grid>
          <Grid item xs></Grid>
          <Grid item>
            <Button onClick={() => dialog.current.close()}>Close</Button>
          </Grid>
        </Grid>
      </Grid>
      <TreeExpanded
        open={isExpanded}
        tree={tree}
        interventions={interventions}
        onClose={() => setIsExpanded(false)}
      />
    </Grid>
  );
};

export default Summary;
