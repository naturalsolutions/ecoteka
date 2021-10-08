import { FC } from "react";
import { makeStyles, Grid, IconButton, Divider } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import AddIcon from "@material-ui/icons/Add";
import { MdFilterList } from "react-icons/md";
import RemoveIcon from "@material-ui/icons/Remove";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { useAppContext } from "@/providers/AppContext";

export type TMapToolbarAction =
  | "zoom_in"
  | "zoom_out"
  | "filter"
  | "toggle_layers"
  | "fit_to_bounds"
  | "geolocate";

export interface IMapToolbarProps {
  onChange?(action: TMapToolbarAction): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: 0,
    right: 0,
    top: 0,
    width: "auto",
    padding: ".2rem",
  },
}));

const MapToolbar: FC<IMapToolbarProps> = ({ onChange }) => {
  const classes = useStyles();
  const { user } = useAppContext();

  const handleActionClick = (action: TMapToolbarAction) => {
    if (typeof onChange === "function") {
      onChange(action);
    }
  };

  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justifyContent="flex-start"
      alignContent="center"
    >
      {user && (
        <Grid item>
          <IconButton
            size="small"
            onClick={() => handleActionClick("fit_to_bounds")}
          >
            <CenterFocusStrongIcon />
          </IconButton>
        </Grid>
      )}
      {user && (
        <Grid item>
          <IconButton
            size="small"
            onClick={() => handleActionClick("geolocate")}
          >
            <MyLocationIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default MapToolbar;
