import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";
import { useAppContext } from "@/providers/AppContext";

export interface EconomyDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const EconomyDashboard: FC<EconomyDashboardProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { user } = useAppContext();

  if (!user?.is_superuser) return null;

  return (
    <CoreOptionsPanel
      label={t("components.Organization.EconomyDashboard.title")}
      items={[]}
    >
      <WorkInProgress
        withHref
        redirectMessage="Calculez-la dès maintenant!"
        href="https://www.baremedelarbre.fr/"
      />
    </CoreOptionsPanel>
  );
};

export default EconomyDashboard;
