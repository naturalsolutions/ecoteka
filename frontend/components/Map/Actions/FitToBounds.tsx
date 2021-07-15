import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { useMapContext } from "@/components/Map/Provider";
import MapActionsAction, {
  MapActionsActionProps,
} from "@/components/Map/Actions/Action";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";

import { useTranslation } from "react-i18next";

export interface MapActionsFitToBoundsProps extends MapActionsActionProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MapActionsFitToBounds: FC<MapActionsFitToBoundsProps> = ({
  isActive = false,
  open = true,
}) => {
  const classes = useStyles();
  const { fitToBounds } = useMapContext();
  const { t } = useTranslation();

  return (
    <MapActionsAction
      open={open}
      name={t("common.fitToBounds")}
      icon={<CenterFocusStrongIcon color="primary" />}
      onClick={() => fitToBounds()}
    />
  );
};

export default MapActionsFitToBounds;
