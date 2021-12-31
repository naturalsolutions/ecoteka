import { FC } from "react";
import {
  makeStyles,
  Theme,
  CircularProgress,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import ExportDataset from "@/components/OrganizationV2/ExportDataset";
import useMetricsTrees from "@/lib/hooks/useMetricsTrees";
import { useAppContext } from "@/providers/AppContext";

export interface OrganizationProgressProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  optionsPanel: {
    minHeight: 240,
  },
}));

interface RatioProgressProps {
  caption: string;
  progressValue: number;
}

const RatioProgress: FC<RatioProgressProps> = ({ caption, progressValue }) => {
  const { t } = useTranslation(["components"]);
  return (
    <Grid
      container
      direction="column"
      alignContent="center"
      alignItems="center"
    >
      <Grid item>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            size={60}
            variant="determinate"
            value={progressValue}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="caption"
              component="div"
              color="textSecondary"
            >{`${Math.round(progressValue)}%`}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        container
        alignContent="center"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" align="center">
          {t(`components.RatioProgress.caption.${caption}`)}
        </Typography>
      </Grid>
    </Grid>
  );
};

const OrganizationProgress: FC<OrganizationProgressProps> = () => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { organization } = useAppContext();
  const fetchMetricsTrees = useMetricsTrees(organization.id);

  const { data: metrics, isLoading: loading } = fetchMetricsTrees();

  return (
    <CoreOptionsPanel
      label={t("components.Organization.Progress.title")}
      items={[]}
    >
      {metrics && (
        <Grid
          className={classes.optionsPanel}
          container
          justifyContent="space-around"
        >
          {Object.keys(metrics.ratio).map((key) => (
            <Grid item xs={6} md={4} key={key}>
              <RatioProgress caption={key} progressValue={metrics.ratio[key]} />
            </Grid>
          ))}
        </Grid>
      )}
      <Grid
        container
        spacing={4}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <ExportDataset />
      </Grid>
    </CoreOptionsPanel>
  );
};

export default OrganizationProgress;
