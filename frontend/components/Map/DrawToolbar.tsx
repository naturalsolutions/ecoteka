import { FC } from "react";
import { makeStyles, Button, Box, Grid } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

export type MapDrawToolbarMode = "selection" | "drawPoint" | "drawPolygon";

export interface MapDrawToolbarProps {
  mode: MapDrawToolbarMode;
  activeDelete?: boolean;
  onDelete?(): void;
  onChange?(mode: MapDrawToolbarMode): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
  },
  delete: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const MapDrawToolbar: FC<MapDrawToolbarProps> = ({
  mode,
  onChange,
  onDelete,
  activeDelete = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation("components");

  const handleOnChange = (e, value: MapDrawToolbarMode) => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  return (
    <Grid container justify="center" alignItems="center">
      <ToggleButtonGroup
        className={classes.root}
        size="small"
        value={mode}
        exclusive
        onChange={handleOnChange}
      >
        <ToggleButton value="selection">
          {t("components.MapDrawToolbar.selection")}
        </ToggleButton>
        <ToggleButton value="drawPoint">
          {t("components.MapDrawToolbar.draw_point")}
        </ToggleButton>
        <ToggleButton value="drawPolygon" disabled>
          {t("components.MapDrawToolbar.draw_polygon")}
        </ToggleButton>
      </ToggleButtonGroup>
      {activeDelete && (
        <Box ml={2}>
          <Button
            className={classes.delete}
            variant="contained"
            onClick={onDelete}
          >
            {t("components.MapDrawToolbar.delete")}
          </Button>
        </Box>
      )}
    </Grid>
  );
};

export default MapDrawToolbar;
