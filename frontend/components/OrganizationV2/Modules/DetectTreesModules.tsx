import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import CoreOptionsPanel from "@/components/Core/OptionsPanel";
import { useTranslation } from "react-i18next";
import WorkInProgress from "@/components/WorkInProgress";
import { useAppContext } from "@/providers/AppContext";

export interface DetectTreesModuleProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const DetectTreesModule: FC<DetectTreesModuleProps> = ({}) => {
  const classes = useStyles();
  const { t } = useTranslation(["components"]);
  const { user } = useAppContext();

  if (!user?.is_superuser) return null;

  return (
    <CoreOptionsPanel
      label={t("components.Organization.DetectTreesModule.title")}
      items={[]}
    >
      <WorkInProgress withHref href="https://www.natural-solutions.eu" />
    </CoreOptionsPanel>
  );
};

export default DetectTreesModule;
