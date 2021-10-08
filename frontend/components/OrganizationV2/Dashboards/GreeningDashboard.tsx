import { FC, useEffect, useState } from "react";
import { Grid, makeStyles, Theme, useTheme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import SimpleMetric from "@/components/Core/Metrics/SimpleMetric";
import { useMeasure } from "react-use";
import { useAppContext } from "@/providers/AppContext";
import { IOrganization } from "@/index";

export interface GreeningDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
}));

const GreeningDashboard: FC<GreeningDashboardProps> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["components"]);
  const { organization } = useAppContext();

  const [isSm, setIsSm] = useState(false);
  const [ref, { width }] = useMeasure();

  useEffect(() => {
    setIsSm(width < theme.breakpoints.values.sm);
  }, [width]);

  const peoplePerTree = ({ population_size, total_trees }: IOrganization) => {
    return population_size && total_trees
      ? Math.ceil(population_size / total_trees)
      : 0;
  };

  const treesPerSquareKm = ({ total_trees, area_sq_km }: IOrganization) => {
    return total_trees && area_sq_km ? Math.ceil(total_trees / area_sq_km) : 0;
  };

  return (
    <CoreOptionsPanel
      ref={ref}
      label={t("components.Organization.GreeningDashboard.title")}
      items={[]}
    >
      <Grid
        container
        direction={setIsSm ? "row" : "row"}
        justifyContent="space-around"
        alignItems="center"
        className={classes.root}
        spacing={2}
      >
        <Grid item>
          <SimpleMetric
            metric={peoplePerTree(organization)}
            caption={t(
              "components.Organization.Dashboards.GreeningDashboard.peoplePerTree",
              { count: peoplePerTree(organization) }
            )}
          />
        </Grid>
        <Grid item>
          <SimpleMetric
            metric={treesPerSquareKm(organization)}
            caption={t(
              "components.Organization.Dashboards.GreeningDashboard.treesPerSquareKm",
              { count: treesPerSquareKm(organization) }
            )}
          />
        </Grid>
      </Grid>
    </CoreOptionsPanel>
  );
};

export default GreeningDashboard;
