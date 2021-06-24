import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";

export interface TreeHealthAssessmentDashboardProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const TreeHealthAssessmentDashboard: FC<TreeHealthAssessmentDashboardProps> =
  ({}) => {
    const classes = useStyles();
    const { t } = useTranslation(["components"]);

    return (
      <CoreOptionsPanel
        label={t("components.Organization.TreeHealthAssessmentDashboard.title")}
        items={[]}
      >
        <WorkInProgress withHref href="https://www.natural-solutions.eu" />
      </CoreOptionsPanel>
    );
  };

export default TreeHealthAssessmentDashboard;
