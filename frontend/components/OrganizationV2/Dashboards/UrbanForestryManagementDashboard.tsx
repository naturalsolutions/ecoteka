import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";

export interface UrbanForestryManagementProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const UrbanForestryManagement: FC<UrbanForestryManagementProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <CoreOptionsPanel
      label={t("components.Organization.UrbanForestryManagement.title")}
      items={[]}
    >
      <WorkInProgress withHref href="https://www.natural-solutions.eu" />
    </CoreOptionsPanel>
  );
};

export default UrbanForestryManagement;
