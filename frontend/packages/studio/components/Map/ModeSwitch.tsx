import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import MultilineChartIcon from "@material-ui/icons/MultilineChart";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import Can from "@/components/Can";

export type TMapMode = "analysis" | "edition";

export interface IMapModeSwitchProps {
  initValue?: TMapMode;
  onChange?(value: TMapMode): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
  },
}));

const MapModeSwitch: React.FC<IMapModeSwitchProps> = ({
  initValue = "analysis",
  onChange,
}) => {
  const classes = useStyles();
  const [mode, setMode] = useState<TMapMode>(initValue);
  const { t } = useTranslation("components");

  const handleOnChange = (e, value: TMapMode) => {
    if (value !== null) {
      setMode(value);
    }

    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  return (
    <Can do="create" on="Trees">
      <ToggleButtonGroup
        className={classes.root}
        value={mode}
        size="small"
        exclusive
        onChange={handleOnChange}
      >
        <ToggleButton value="analysis">
          <MultilineChartIcon />
          {t("components.MapModeSwitch.analysis")}
        </ToggleButton>
        <ToggleButton value="edition">
          <EditLocationIcon />
          {t("components.MapModeSwitch.edition")}
        </ToggleButton>
      </ToggleButtonGroup>
    </Can>
  );
};

export default MapModeSwitch;
