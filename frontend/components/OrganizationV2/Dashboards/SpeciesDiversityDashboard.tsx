import { FC, useEffect, useMemo, useState, createRef } from "react";
import {
  makeStyles,
  Theme,
  IconButton,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useMeasure, useWindowSize } from "react-use";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";
import RichTooltip from "@/components/Feedback/RichTooltip";
import { MapPreview } from "@/components/OrganizationV2/Header";
import { useAppContext } from "@/providers/AppContext";
import SpeciesPreview from "@/components/OrganizationV2/SpeciesDiversity/SpeciesPreview";
import useApi from "@/lib/useApi";
import { styles } from "@material-ui/pickers/views/Clock/Clock";

export interface SpeciesDiversityDashboardProps {
  wip?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  subtitles: {
    color: theme.palette.grey[700],
  },
}));

const options = {
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const SpeciesDiversityDashboard: FC<SpeciesDiversityDashboardProps> = ({
  wip = false,
}) => {
  const [ref, { width }] = useMeasure();
  const classes = useStyles();
  const theme = useTheme();
  const { organization } = useAppContext();
  const { apiETK } = useApi().api;
  const { t } = useTranslation(["components"]);
  const [metrics, setMetrics] = useState(undefined);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const newIsMobile = Boolean(width < 600);
    setIsMobile(newIsMobile);
  }, [width]);

  const [speciesAggregates, setSpeciesAggregates] = useState([]);

  const fetchMetrics = async (organizationId: number) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/trees/metrics?fields=canonicalName`
      );
      if (status === 200) {
        if (data) {
          setMetrics(data);
        }
      }
    } catch ({ response, request }) {
      if (response) {
        console.log(response);
      }
    }
  };

  const randomRgba = (a: number) => {
    const num = Math.round(0xffffff * Math.random());
    const r = num >> 16;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgb(${r},${g},${b},${a}`;
  };

  const formatBarChartData = (data) => {
    let labels = [];
    let chartData = [];
    let colors = [];

    data.map((object) => {
      labels.push(object.value);
      chartData.push(object.total);
      colors.push(randomRgba(0.9));
    });

    const formattedData = {
      labels: labels,
      datasets: [
        {
          label: t(
            "components.Organization.SpeciesDiversityDashboard.taxaReparitionChart.label"
          ),
          data: chartData,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };
    return formattedData;
  };

  const memoizedData = useMemo(() => {
    if (speciesAggregates.length > 0) {
      return formatBarChartData(speciesAggregates);
    }
  }, [speciesAggregates]);

  useEffect(() => {
    fetchMetrics(organization?.id);
  }, [organization]);

  useEffect(() => {
    if (metrics?.aggregates?.canonicalName) {
      setSpeciesAggregates(metrics.aggregates.canonicalName);
    }
  }, [metrics?.aggregates?.canonicalName]);

  if (wip) {
    return (
      <CoreOptionsPanel
        ref={ref}
        label={t("components.Organization.SpeciesDiversityDashboard.title")}
        items={[]}
      >
        <WorkInProgress withHref href="https://www.natural-solutions.eu" />
      </CoreOptionsPanel>
    );
  }

  return (
    <CoreOptionsPanel
      ref={ref}
      label={t("components.Organization.SpeciesDiversityDashboard.title")}
      items={[]}
      withTooltip
      Tooltip={
        <WorkInProgress withHref href="https://www.natural-solutions.eu" />
      }
    >
      <Typography
        variant="subtitle2"
        className={classes.subtitles}
        gutterBottom
      >
        {t("components.Organization.Dashboards.SpeciesDiversity.topTaxa")}
      </Typography>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        spacing={2}
      >
        {speciesAggregates.slice(0, 5).map((species, index) => (
          <SpeciesPreview
            canonicalName={species.value}
            key={`species-${index}`}
          />
        ))}
      </Grid>
      <Typography
        variant="subtitle2"
        className={classes.subtitles}
        gutterBottom
      >
        {t(
          "components.Organization.Dashboards.SpeciesDiversity.taxaRepartition"
        )}
      </Typography>
      {speciesAggregates.length > 0 &&
        (isMobile ? (
          <Bar
            type="bar"
            data={memoizedData}
            options={{ ...options, indexAxis: "y" }}
            width={width}
            height={500}
          />
        ) : (
          <Bar
            type="bar"
            data={memoizedData}
            options={{ ...options, indexAxis: "x" }}
            width={width}
          />
        ))}
    </CoreOptionsPanel>
  );
};

const MemoizedSpeciesDiversityDashboard: FC<SpeciesDiversityDashboardProps> = (
  props
) => {
  const { organization } = useAppContext();
  const { width } = useWindowSize();

  return useMemo(
    () => <SpeciesDiversityDashboard {...props} />,
    [organization, width]
  );
};
export default MemoizedSpeciesDiversityDashboard;
