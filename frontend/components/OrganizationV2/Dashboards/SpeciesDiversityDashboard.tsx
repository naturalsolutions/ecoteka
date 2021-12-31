import { FC, useEffect, useMemo, useState, useRef } from "react";
import {
  makeStyles,
  Theme,
  Grid,
  Typography,
  useTheme,
  LinearProgress,
} from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useMeasure, useWindowSize } from "react-use";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";
import { useAppContext } from "@/providers/AppContext";
import SpeciesPreview from "@/components/OrganizationV2/SpeciesDiversity/SpeciesPreview";
import useMetricsTrees from "@/lib/hooks/useMetricsTrees";

export interface SpeciesDiversityDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  subtitles: {
    color: theme.palette.grey[700],
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  bar: {
    width: "100%",
  },
}));

const defaultOptions = {
  indexAxis: "x",
  aspectRatio: 2,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
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

const randomRgba = (a: number) => {
  const num = Math.round(0xffffff * Math.random());
  const r = num >> 16;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgb(${r},${g},${b},${a}`;
};

const SpeciesDiversityDashboard: FC<SpeciesDiversityDashboardProps> = () => {
  const [ref, { width }] = useMeasure();
  const { width: windowWidth } = useWindowSize();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["components"]);
  const [isMobile, setIsMobile] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const barRef = useRef(null);
  const { organization } = useAppContext();
  const fetchMetricsTrees = useMetricsTrees(organization.id);

  const { data: metrics, isLoading: loading } = fetchMetricsTrees();

  useEffect(() => {
    setOptions({
      ...options,
      indexAxis: isMobile ? "y" : "x",
      aspectRatio: isMobile ? 1 : 2,
    });
  }, [isMobile]);

  useEffect(() => {
    setIsMobile(
      width < theme.breakpoints.values.sm ||
        windowWidth < theme.breakpoints.values.sm
    );
    if (windowWidth < width && barRef) {
      if (barRef?.current) {
        barRef.current.resize(windowWidth - 56, barRef.current.height);
      }
    }
  }, [width, windowWidth, barRef]);

  const formatBarChartData = (data) => {
    let labels = [];
    let chartData = [];
    let colors = [];

    isMobile
      ? data.slice(0, 10).map((object) => {
          labels.push(object.value);
          chartData.push(object.total);
          colors.push(randomRgba(0.9));
        })
      : data.map((object) => {
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
    if (metrics?.aggregates.canonicalName?.length > 0) {
      return formatBarChartData(metrics.aggregates.canonicalName);
    }
  }, [metrics?.aggregates.canonicalName]);

  return (
    <CoreOptionsPanel
      ref={ref}
      label={t("components.Organization.SpeciesDiversityDashboard.title")}
      items={[]}
      withTooltip={!isMobile}
      Tooltip={
        <WorkInProgress withHref href="https://www.natural-solutions.eu" />
      }
    >
      {loading && <LinearProgress />}
      {metrics?.aggregates.canonicalName?.length > 0 && (
        <>
          <Typography
            variant="subtitle2"
            className={classes.subtitles}
            gutterBottom
          >
            {t("components.Organization.Dashboards.SpeciesDiversity.topTaxa")}
          </Typography>
          <Grid
            container
            direction={isMobile ? "column" : "row"}
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
          >
            {metrics?.mostRepresented.map((species, index) => (
              <SpeciesPreview
                isMini={isMobile}
                canonicalName={species.value}
                ratio={species.total / metrics?.canonicalNameTotalCount}
                key={`species-${index}`}
                thumbnail={species?.thumbnail}
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
          <Bar
            className={classes.bar}
            ref={barRef}
            type="bar"
            data={memoizedData}
            options={{ ...options }}
          />
        </>
      )}
    </CoreOptionsPanel>
  );
};

const MemoizedSpeciesDiversityDashboard: FC<SpeciesDiversityDashboardProps> =
  () => {
    const { organization } = useAppContext();
    const { width } = useWindowSize();

    return useMemo(() => <SpeciesDiversityDashboard />, [organization, width]);
  };
export default MemoizedSpeciesDiversityDashboard;
