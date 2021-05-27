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
      title={t("components.Organization.EconomyDashboard.title")}
      items={[]}
    >
      <WorkInProgress withHref href="https://www.natural-solutions.eu" />
    </CoreOptionsPanel>
  );
};

export default EconomyDashboard;
