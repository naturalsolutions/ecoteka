import { FC, useState, useEffect } from "react";
import useApi from "@/lib/useApi";
import { Box, Button, Grid } from "@material-ui/core";
import InterventionsTable from "@/components/Interventions/InterventionsTable";
import { useAppContext } from "@/providers/AppContext";
import { useAppLayout } from "@/components/AppLayout/Base";
import { TIntervention } from "@/components/Interventions/Schema";
import TreeInfosProperties from "@/components/Tree/Infos/Properties";
import { useRouter } from "next/router";
import { AppLayoutCartoDialog } from "@/components/AppLayout/Carto";
import BackToMap from "@/components/Map/BackToMap";

const Summary: FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const { organization } = useAppContext();
  const { api } = useApi();
  const { apiETK } = api;
  const [tree, setTree] = useState<any>({});
  const [interventions, setInterventions] = useState<TIntervention[]>();
  const { dialog } = useAppLayout();
  const router = useRouter();

  const getTree = async (id: number) => {
    if (organization) {
      try {
        const { data, status } = await apiETK.get(
          `/organization/${organization.id}/trees/${id}`
        );

        if (status === 200) {
          setTree(data);
        }
      } catch (error) {}
    }
  };

  const getInterventions = async (id: number) => {
    if (organization) {
      try {
        const { data, status } = await apiETK.get(
          `/organization/${organization.id}/trees/${id}/interventions`
        );

        if (status === 200) {
          setInterventions(data);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    const { query, route } = router;

    if (
      route === "/[organizationSlug]/map" &&
      query.panel === "info" &&
      query.tree
    ) {
      const id = Number(router.query.tree);
      getTree(id);
      getInterventions(id);
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  return (
    active && (
      <AppLayoutCartoDialog actions={<BackToMap />}>
        <Grid container direction="column">
          <Grid item>
            <TreeInfosProperties tree={tree} />
          </Grid>
          <Grid item>
            <Box mt={5}>
              <InterventionsTable
                interventions={interventions}
                tree={tree}
                onNewIntervention={() => {
                  dialog.current.close();
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </AppLayoutCartoDialog>
    )
  );
};

export default Summary;
