import { FC, useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  CircularProgress,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import CoreOptionsPanel from "../Core/OptionsPanel";
import { useAppContext } from "@/providers/AppContext";
import useApi from "@/lib/useApi";
import { useTranslation } from "react-i18next";

export interface OrganizationProgressProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
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
        justify="center"
      >
        <Typography variant="caption" align="center">
          {t(`components.RatioProgress.caption.${caption}`)}
        </Typography>
      </Grid>
    </Grid>
  );
};

const OrganizationProgress: FC<OrganizationProgressProps> = ({}) => {
  const classes = useStyles();
  const { organization } = useAppContext();
  const { apiETK } = useApi().api;
  const [metrics, setMetrics] = useState(undefined);

  const fetchMetrics = async (organizationId: number) => {
    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/trees/metrics?fields=canonicalName,vernacularName,diameter,height,plantingDate`
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

  useEffect(() => {
    fetchMetrics(organization?.id);
  }, [organization]);

  useEffect(() => {
    console.log(metrics);
  }, [metrics]);

  return (
    <CoreOptionsPanel title={"COMPLÉTION DU JEU DE DONNÉES"} items={[]}>
      {metrics && (
        <Grid container spacing={4}>
          {Object.keys(metrics.ratio).map((key) => (
            <Grid item xs={6} md={3}>
              <RatioProgress caption={key} progressValue={metrics.ratio[key]} />
            </Grid>
          ))}
        </Grid>
      )}
    </CoreOptionsPanel>
  );
};

export default OrganizationProgress;
