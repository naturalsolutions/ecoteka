import { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { useMapContext } from "@/components/Map/Provider";
import MapActionsAction, {
  MapActionsActionProps,
} from "@/components/Map/Actions/Action";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import { FlyToInterpolator } from "@deck.gl/core";
import { useTranslation } from "react-i18next";

export interface MapActionsGeolocationProps extends MapActionsActionProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const MapActionsGeolocation: FC<MapActionsGeolocationProps> = ({
  isActive = false,
  open = true,
}) => {
  const classes = useStyles();
  const { viewState, setViewState } = useMapContext();
  const { t } = useTranslation();

  return (
    navigator?.geolocation && (
      <MapActionsAction
        isActive={isActive}
        open={open}
        name={t("common.geolocate")}
        icon={<MyLocationIcon color="primary" />}
        onClick={() => {
          navigator.geolocation.getCurrentPosition((position) => {
            setViewState({
              ...viewState,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              zoom: 16,
              transitionDuration: 1500,
              transitionInterpolator: new FlyToInterpolator(),
            });
          });
        }}
      />
    )
  );
};

export default MapActionsGeolocation;
