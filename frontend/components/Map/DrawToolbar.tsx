import { FC, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

export type TMapDrawToolbarMode = "selection" | "drawPoint" | "drawPolygon";

export interface IMapDrawToolbarProps {
  onChange?(mode: TMapDrawToolbarMode): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
  },
}));

const MapDrawToolbar: FC<IMapDrawToolbarProps> = ({ onChange }) => {
  const classes = useStyles();
  const [mode, setMode] = useState<TMapDrawToolbarMode>("selection");
  const { t } = useTranslation("components");

  const handleOnChange = (e, value: TMapDrawToolbarMode) => {
    if (value !== null) {
      setMode(value);
    }

    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  return (
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
  );
};

export default MapDrawToolbar;
