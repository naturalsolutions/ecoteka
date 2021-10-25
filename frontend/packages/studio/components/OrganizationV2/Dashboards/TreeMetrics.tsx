import { FC, useEffect, useState } from "react";
import { Grid, makeStyles, Theme, LinearProgress } from "@material-ui/core";
import Tree from "@/components/Core/Icons/Tree";
import Trunk from "@/components/Core/Icons/Trunk";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import SimpleMetric from "@/components/Core/Metrics/SimpleMetric";
import useApi from "@/lib/useApi";

export interface TreeMetricsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const TreeMetrics: FC<TreeMetricsProps> = ({}) => {
  const { t } = useTranslation(["components"]);
  const { user, organization } = useAppContext();
  const { apiETK } = useApi().api;
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState(null);

  const fetchMetrics = async (year: number) => {
    setIsLoading(true);
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organization.id}/metrics_by_year/${year}`
      );
      if (status === 200) {
        if (data) {
          setMetrics(data);
        }
      }
      setIsLoading(false);
    } catch ({ response, request }) {
      if (response) {
        // console.log(response);
      }
      setIsLoading(false);
    }
  };

  const displayedMetrics = [
    {
      key: "planted_trees_count",
      caption: `${t(
        "components.Organization.Dashboards.TreeMetrics.plantedTreesCaption"
      )}`,
      iconComponent: <Tree style={{ fontSize: 52 }} />,
    },
    {
      key: "logged_trees_count",
      caption: `${t(
        "components.Organization.Dashboards.TreeMetrics.loggedTreesCaption"
      )}`,
      iconComponent: <Trunk style={{ fontSize: 52 }} />,
    },
  ];

  useEffect(() => {
    fetchMetrics(year);
  }, [year, organization]);

  if (!user?.is_superuser) return null;

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
        {isLoading && <LinearProgress />}
        {metrics &&
          displayedMetrics.map((metric) => (
            <Grid item key={metric.key}>
              <SimpleMetric
                metric={metrics[metric.key]}
                caption={metric.caption}
                icon={metric.iconComponent}
              />
            </Grid>
          ))}
      </Grid>
    </CoreOptionsPanel>
  );
};

export default TreeMetrics;
