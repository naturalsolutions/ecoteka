import { FC, ReactElement, useState } from "react";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";

import { Box, IconButton, Tooltip, makeStyles } from "@material-ui/core";
import Can from "@/components/Can";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";

import LayersIcon from "@material-ui/icons/Layers";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import BackupIcon from "@material-ui/icons/Backup";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  actionsBar: {
    position: "absolute",
    top: 0,
    right: 8,
    display: "flex",
    flexDirection: "column",
    height: "auto",
    [theme.breakpoints.up("sm")]: {
      top: 8,
      left: 8,
      right: "unset",
    },
  },
  [theme.breakpoints.up("sm")]: {
    actionBar: {
      top: 60,
    },
  },
}));

export type MapActionsBarActionType = "info" | "filter" | "layers" | "import";

export interface MapActionBarAction {
  action: MapActionsBarActionType;
  icon: ReactElement;
  do: Actions;
  on: Subjects;
}

export type MapActionBarActions = MapActionBarAction[];

export interface MapActionsBarProps {
  isMenuOpen?: boolean;
  onClick?(action: MapActionsBarActionType): void;
}

const actions = [
  { action: "start", icon: <InfoIcon />, do: "read", on: "Trees" },
  { action: "filter", icon: <SearchIcon />, do: "read", on: "Trees" },
  { action: "layers", icon: <LayersIcon />, do: "read", on: "Trees" },
  { action: "import", icon: <BackupIcon />, do: "create", on: "Trees" },
] as MapActionBarActions;

const MapActionsBar: FC<MapActionsBarProps> = ({
  isMenuOpen = false,
  onClick = () => {},
}) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const darkBackground = theme.palette.type === "dark";
  const classes = useStyles();
  const [activeAction, setActiveAction] = useState<MapActionsBarActionType>(
    "start" as MapActionsBarActionType
  );

  const handleOnActionClick = (action: MapActionsBarActionType) => {
    setActiveAction(action);
    onClick(action);
  };

  return (
    <Box className={classes.actionsBar}>
      {actions.map((action) => {
        return (
          <Can key={action.action as string} do={action.do} on={action.on}>
            <Tooltip
              placement="right"
              title={
                t("components.MapActionBar", { returnObjects: true })[
                  action.action
                ]
              }
            >
              <IconButton
                style={{
                  color: darkBackground ? "#fff" : "",
                }}
                color={activeAction === action.action ? "primary" : "default"}
                onClick={() => handleOnActionClick(action.action)}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          </Can>
        );
      })}
    </Box>
  );
};

export default MapActionsBar;
