import { FC, ReactElement, useState } from "react";

import { Box, IconButton, Tooltip, makeStyles } from "@material-ui/core";
import Can from "@/components/Can";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";

import LayersIcon from "@material-ui/icons/Layers";
import CloseIcon from "@material-ui/icons/Close";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import BackupIcon from "@material-ui/icons/Backup";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  actionsBar: {
    position: "absolute",
    top: 8,
    left: 8,
    display: "flex",
    flexDirection: "column",
  },
}));

export type MapActionsBarActionType =
  | "menu"
  | "info"
  | "filter"
  | "layers"
  | "import";

export interface MapActionBarAction {
  action: MapActionsBarActionType;
  icon: ReactElement;
  do: Actions;
  on: Subjects;
}

export type MapActionBarActions = MapActionBarAction[];

export interface MapActionsBarProps {
  isMenuOpen?: boolean;
  darkBackground?: boolean;
  onClick?(action: MapActionsBarActionType): void;
}

const actions = [
  { action: "menu", icon: <MenuOpenIcon />, do: "read", on: "Trees" },
  { action: "start", icon: <InfoIcon />, do: "read", on: "Trees" },
  { action: "filter", icon: <SearchIcon />, do: "read", on: "Trees" },
  { action: "layers", icon: <LayersIcon />, do: "read", on: "Trees" },
  { action: "import", icon: <BackupIcon />, do: "create", on: "Trees" },
] as MapActionBarActions;

const MapActionsBar: FC<MapActionsBarProps> = ({
  isMenuOpen = false,
  darkBackground = false,
  onClick = () => {},
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [activeAction, setActiveAction] = useState<MapActionsBarActionType>(
    "start" as MapActionsBarActionType
  );

  const handleOnActionClick = (action: MapActionsBarActionType) => {
    if (action !== "menu") {
      setActiveAction(action);
    }

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
                {action.action === "menu" &&
                  (isMenuOpen ? <CloseIcon /> : <MenuOpenIcon />)}
                {action.action !== "menu" && action.icon}
              </IconButton>
            </Tooltip>
          </Can>
        );
      })}
    </Box>
  );
};

export default MapActionsBar;
