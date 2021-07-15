import { FC, useState } from "react";
import { makeStyles, Theme, SvgIcon } from "@material-ui/core";
import MapActionsAction, {
  MapActionsActionProps,
} from "@/components/Map/Actions/Action";
import IconTree from "@/public/assets/icons/icon_tree.svg";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/providers/AppContext";

export interface MapActionsCreateTreeProps extends MapActionsActionProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MapActionsCreateTree: FC<MapActionsCreateTreeProps> = ({
  open = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAppContext();
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    user && (
      <MapActionsAction
        isActive={isActive}
        open={open}
        action="create"
        subject="Trees"
        name={
          isActive ? t("common.disableDrawTree") : t("common.activateDrawTree")
        }
        icon={
          <SvgIcon
            htmlColor={isActive ? "white" : "#46b9b1"}
            component={IconTree}
            viewBox="0 0 24 32"
          />
        }
        onClick={() => {
          setIsActive(!isActive);
        }}
      />
    )
  );
};

export default MapActionsCreateTree;
