import { FC } from "react";
import { makeStyles, Grid, IconButton, Divider } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import AddIcon from "@material-ui/icons/Add";
import { MdFilterList } from "react-icons/md";
import RemoveIcon from "@material-ui/icons/Remove";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import SearchIcon from "@material-ui/icons/Search";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { fade } from "@material-ui/core/styles/colorManipulator";

export type TMapToolbarAction =
  | "zoom_in"
  | "zoom_out"
  | "filter"
  | "toggle_layers"
  | "fit_to_bounds"
  | "geolocate"
  | "import";

export interface IMapToolbarProps {
  onChange?(action: TMapToolbarAction): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    transition: "background-color 0.3s ease",
    background: fade(theme.palette.background.default, 0.3),
    borderLeft: "1px solid #ccc",
    borderLeftColor: fade(theme.palette.background.default, 0.7),
    "&:hover": {
      background: fade(theme.palette.background.default, 0.5),
    },
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
      justify="flex-start"
      alignContent="center"
    >
      <Grid item>
        <IconButton onClick={() => handleActionClick("zoom_in")}>
          <AddIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("zoom_out")}>
          <RemoveIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("filter")}>
          <MdFilterList />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("toggle_layers")}>
          <LayersIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("fit_to_bounds")}>
          <CenterFocusStrongIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("geolocate")}>
          <MyLocationIcon />
        </IconButton>
      </Grid>
      <Grid item xs />
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <IconButton onClick={() => handleActionClick("import")}>
          <CloudDownloadIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default MapToolbar;
