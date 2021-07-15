import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import MapActionsAction, {
  MapActionsActionProps,
} from "@/components/Map/Actions/Action";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";
import SelectIcon from "@material-ui/icons/PhotoSizeSelectSmall";
import { useMapContext } from "../Provider";

export interface MapActionsSelectionProps extends MapActionsActionProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MapActionsSelection: FC<MapActionsSelectionProps> = ({
  open = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAppContext();
  const { editionMode, setEditionMode } = useMapContext();

  return (
    user && (
      <MapActionsAction
        action="delete"
        subject="Trees"
        open={open}
        isActive={editionMode}
        name={
          editionMode
            ? t("common.disableSelectTrees")
            : t("common.activateSelectTrees")
        }
        icon={<SelectIcon htmlColor={editionMode ? "white" : "#46b9b1"} />}
        onClick={() => setEditionMode(!editionMode)}
      />
    )
  );
};

export default MapActionsSelection;
