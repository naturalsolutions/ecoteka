import { FC, useState, useEffect } from "react";
import useApi from "@/lib/useApi";
import { Button, Grid, makeStyles } from "@material-ui/core";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { useAppContext } from "@/providers/AppContext";
import { useAppLayout } from "@/components/AppLayout/Base";
import { TIntervention } from "@/components/Interventions/Schema";
import TreeInfosProperties from "@/components/Tree/Infos/Properties";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const useStyles = makeStyles(() => ({
  root: {},
}));

const Summary: FC<{ treeId: number }> = ({ treeId }) => {
  const { user } = useAppContext();
  const { api } = useApi();
  const { apiETK } = api;
  const { t } = useTranslation("components");
  const [tree, setTree] = useState<any>({});
  const [interventions, setInterventions] = useState<TIntervention[]>();
  const { dialog } = useAppLayout();
  const classes = useStyles();
  const router = useRouter();

  const getTree = async (id: number) => {
    if (user?.currentOrganization) {
      try {
        const { data, status } = await apiETK.get(
          `/organization/${user.currentOrganization.id}/trees/${id}`
        );

        if (status === 200) {
          setTree(data);
        }
      } catch (error) {}
    }
  };

  const getInterventions = async (id: number) => {
    if (user?.currentOrganization) {
      try {
        const { data, status } = await apiETK.get(
          `/organization/${user.currentOrganization.id}/trees/${id}/interventions`
        );

        if (status === 200) {
          setInterventions(data);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (router?.query?.tree) {
      const id = Number(router.query.tree);
      getTree(id);
      getInterventions(id);
    }
  }, [router]);

  return (
    <Grid className={classes.root} container direction="column" spacing={2}>
      <Grid item>
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
    </Grid>
  );
};

export default Summary;
