import { FC } from "react";
import { Grid, makeStyles, Theme, LinearProgress } from "@material-ui/core";
import Tree from "@/components/Core/Icons/Tree";
import Trunk from "@/components/Core/Icons/Trunk";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import SimpleMetric from "@/components/Core/Metrics/SimpleMetric";
import useMetricsByYear from "@/lib/hooks/useMetricsByYear";

export interface TreeMetricsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const TreeMetrics: FC<TreeMetricsProps> = () => {
  const { t } = useTranslation(["components"]);
  const { user, organization } = useAppContext();
  const year = new Date().getFullYear();

  if (!user?.is_superuser) return null;

  const fetchMetricsTrees = useMetricsByYear(organization.id, year);

  const { data: metrics, isLoading: loading } = fetchMetricsTrees();

  const displayedMetrics = [
    {
      key: "planted_trees_count",
      value: metrics?.planted_trees_count,
      caption: `${t(
        "components.Organization.Dashboards.TreeMetrics.plantedTreesCaption"
      )}`,
      iconComponent: <Tree style={{ fontSize: 52 }} />,
    },
    {
      key: "logged_trees_count",
      value: metrics?.logged_trees_count,
      caption: `${t(
        "components.Organization.Dashboards.TreeMetrics.loggedTreesCaption"
      )}`,
      iconComponent: <Trunk style={{ fontSize: 52 }} />,
    },
  ];

  return (
    <CoreOptionsPanel
      label={`${t(
        "components.Organization.Dashboards.TreeMetrics.title"
      )} ${year}`}
      items={[]}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={4}
      >
        {loading ? (
          <LinearProgress />
        ) : (
          displayedMetrics.map((metric) => (
            <Grid item key={metric.key}>
              <SimpleMetric
                metric={metric.value}
                caption={metric.caption}
                icon={metric.iconComponent}
              />
            </Grid>
          ))
        )}
      </Grid>
    </CoreOptionsPanel>
  );
};

export default TreeMetrics;
