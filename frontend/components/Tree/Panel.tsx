import { FC, useContext } from "react";
import { Grid, makeStyles, Theme, Button } from "@material-ui/core";
import { AppLayoutCartoDialog } from "../AppLayout/Carto";
import TreeBasicForm from "./BasicForm";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import Can, { AbilityContext } from "@/components/Can";

import TreeImagesContainer from "@/components/Tree/Images/Container";
import TreeProvider from "@/components/Tree/Provider";
import InterventionsWorkflow from "@/components/Interventions/Workflow";
import InterventionProvider from "@/components/Interventions/Provider";

export interface TreePanelProps {}

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    padding: theme.spacing(1),
    "& > .MuiGrid-item": {
      marginBottom: "2rem",
    },
  },
}));

const TreePanel: FC<TreePanelProps> = ({}) => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  const { organization } = useAppContext();
  const [active, setActive] = useState<boolean>(false);
  const ability = useContext(AbilityContext);

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "info") {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [router.query]);

  const handleGoToTreePage = () => {
    router.push({
      pathname: "/[organizationSlug]/tree/[id]",
      query: {
        organizationSlug: organization.slug,
        id: router.query.tree,
      },
    });
  };

  return (
    active && (
      <TreeProvider
        organizationId={organization.id}
        treeId={Number(router.query.tree)}
      >
        <InterventionProvider>
          <AppLayoutCartoDialog
            actions={
              ability.can("read", "Trees") ? (
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleGoToTreePage}
                >
                  {ability.can("update", "Trees")
                    ? t("components.Tree.Panel.actions.update")
                    : t("components.Tree.Panel.actions.read")}
                </Button>
              ) : null
            }
          >
            <TreeImagesContainer />
            <Grid container direction="column" className={classes.grid}>
              <Grid item>
                <TreeBasicForm readOnly={true} />
              </Grid>
              <Can do="read" on="Interventions">
                <Grid item>
                  <InterventionsWorkflow
                    selectable={false}
                    insidePanel={true}
                  />
                </Grid>
              </Can>
            </Grid>
          </AppLayoutCartoDialog>
        </InterventionProvider>
      </TreeProvider>
    )
  );
};

export default TreePanel;
