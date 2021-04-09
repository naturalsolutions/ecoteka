import { FC } from "react";
import { Grid, makeStyles, Theme, Button } from "@material-ui/core";
import { AppLayoutCartoDialog } from "../AppLayout/Carto";
import TreeBasicForm from "./BasicForm";
import useTreeForm from "./useForm";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import useTree from "@/lib/hooks/useTree";
import useApi from "@/lib/useApi";
import TreeImagesContainer from "@/components/Tree/Images/Container";
import { Tree } from "@/index";
import { useMemo } from "react";
import TreeInterventions from "@/components/Tree/Interventions";
import TreeHealthAssessment from "./HealthAssessment";

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
  const { apiETK } = useApi().api;
  const fetchTree = useTree(apiETK);
  const form = useTreeForm();
  const [tree, setTree] = useState<Tree>(null);

  useEffect(() => {
    const { query, route } = router;

    if (route === "/[organizationSlug]/map" && query.panel === "info") {
      setActive(true);

      if (query.tree && query.tree !== String(tree?.id)) {
        (async () => {
          const newTree = await fetchTree(organization.id, String(query.tree));

          setTree(newTree);
        })();
      }
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

  useEffect(() => {
    if (tree?.properties) {
      Object.keys(tree.properties).forEach((property) =>
        form.setValue(property, tree.properties[property])
      );
    }
  }, [tree]);

  return useMemo(
    () =>
      active && (
        <AppLayoutCartoDialog withoutContent={true}>
          <TreeImagesContainer tree={tree} />
          <Grid container direction="column" className={classes.grid}>
            <Grid item>
              <TreeBasicForm readOnly={true} form={form} />
            </Grid>
            <Grid item>
              <TreeInterventions treeId={tree?.id} />
            </Grid>
            <Grid item>
              <TreeHealthAssessment treeId={tree?.id} />
            </Grid>
            <Grid item>
              <Button
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGoToTreePage}
              >
                {t("common.buttons.moreDetails")}
              </Button>
            </Grid>
          </Grid>
        </AppLayoutCartoDialog>
      ),
    [tree]
  );
};

export default TreePanel;
