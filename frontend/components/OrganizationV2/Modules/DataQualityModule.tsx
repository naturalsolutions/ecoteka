import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";

export interface DataQualityModuleProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const DataQualityModule: FC<DataQualityModuleProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);

  return (
    <CoreOptionsPanel
      title={t("components.Organization.DataQualityModule.title")}
      items={[]}
    >
      <WorkInProgress withHref href="https://www.natural-solutions.eu" />
    </CoreOptionsPanel>
  );
};

export default DataQualityModule;
