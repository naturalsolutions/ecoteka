import { FC, useState, useEffect } from "react";
import { apiRest } from "@/lib/api";
import { Button, Grid, makeStyles } from "@material-ui/core";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { useAppContext } from "@/providers/AppContext";
import TreeExpanded from "@/components/Tree/Infos/Expanded";
import { useAppLayout } from "@/components/appLayout/Base";
import { TIntervention } from "@/components/Interventions/Schema";
import TreeInfosProperties from "@/components/Tree/Infos/Properties";

const useStyles = makeStyles(() => ({
  root: {
    width: "24rem",
  },
}));

const Summary: FC<{ id: number }> = ({ id }) => {
  const { user } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tree, setTree] = useState<any>({});
  const [interventions, setInterventions] = useState<TIntervention[]>();
  const { dialog } = useAppLayout();
  const classes = useStyles();

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
    <Grid className={classes.root} container direction="column" spacing={2}>
      <Grid item xs={12}>
        <TreeInfosProperties tree={tree} />
      </Grid>
      <Grid item>
        {interventions && (
          <InterventionsTable
            interventions={interventions}
            tree={tree}
            onNewIntervention={() => {
              dialog.current.close();
            }}
          />
        )}
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setIsExpanded(true)}
        >
          Plus de détails
        </Button>
      </Grid>
      <TreeExpanded
        open={isExpanded}
        tree={tree}
        interventions={interventions}
        onClose={() => setIsExpanded(false)}
        onChange={(newTree) => setTree(newTree)}
      />
    </Grid>
  );
};

export default Summary;
