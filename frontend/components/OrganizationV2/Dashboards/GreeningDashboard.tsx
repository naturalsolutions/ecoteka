import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";

export interface GreeningDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const GreeningDashboard: FC<GreeningDashboardProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <CoreOptionsPanel
      label={t("components.Organization.GreeningDashboard.title")}
      items={[]}
    >
      <WorkInProgress withHref href="https://www.natural-solutions.eu" />
    </CoreOptionsPanel>
  );
};

export default GreeningDashboard;
