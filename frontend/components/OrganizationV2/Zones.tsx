import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";

export interface EconomyDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const EconomyDashboard: FC<EconomyDashboardProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <CoreOptionsPanel
      label={t("components.Organization.Zones.title")}
      items={[]}
    >
      <WorkInProgress />
    </CoreOptionsPanel>
  );
};

export default EconomyDashboard;
