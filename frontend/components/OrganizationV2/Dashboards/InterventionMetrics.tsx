import { FC, useEffect, useState } from "react";
import { Grid, makeStyles, Theme, LinearProgress } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import SimpleMetric from "@/components/Core/Metrics/SimpleMetric";
import useApi from "@/lib/useApi";
import { useRouter } from "next/router";

export interface InterventionMetricsProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const InterventionMetrics: FC<InterventionMetricsProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { user, organization } = useAppContext();
  const { apiETK } = useApi().api;
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState(null);
  const router = useRouter();

  // Should be defined in Organization config
  const setCurrency = (locale: string): string => {
    switch (locale) {
      case "fr":
      case "es":
        return "EUR";
      case "en":
        return "USD";
      default:
        return "EUR";
    }
  };

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
      key: "done_interventions_cost",
      caption: `${t(
        "components.Organization.Dashboards.InterventionMetrics.doneCaption"
      )}`,
    },
    {
      key: "scheduled_interventions_cost",
      caption: `${t(
        "components.Organization.Dashboards.InterventionMetrics.scheduledCaption"
      )}`,
    },
  ];

  useEffect(() => {
    fetchMetrics(year);
  }, [year, organization]);

  if (!user?.is_superuser) return null;

  return (
    <CoreOptionsPanel
      label={`${t(
        "components.Organization.Dashboards.InterventionMetrics.title"
      )} ${year}`}
      items={[]}
    >
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={4}
      >
        {(isLoading || !metrics) && <LinearProgress />}
        {metrics &&
          displayedMetrics.map((metric) => (
            <Grid item key={metric.key}>
              <SimpleMetric
                metric={metrics[metric.key]?.toLocaleString(router.locale, {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: setCurrency(router.locale),
                })}
                caption={metric.caption}
              />
            </Grid>
          ))}
      </Grid>
    </CoreOptionsPanel>
  );
};

export default InterventionMetrics;
