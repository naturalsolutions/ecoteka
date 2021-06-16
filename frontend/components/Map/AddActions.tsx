import { FC, ReactElement, useState } from "react";
import {
  makeStyles,
  Theme,
  SvgIconProps,
  SvgIcon,
  Icon,
  useMediaQuery,
  useTheme,
  Fab,
  Tooltip,
} from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import IconTree from "@/public/assets/icons/icon_tree.svg";
import { MapDrawToolbarMode } from "@/components/Map/DrawToolbar";
import { useTranslation } from "react-i18next";

export interface MapAddActionsProps {
  onChange(action: string);
}

const useStyles = makeStyles((theme: Theme) => ({
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  staticTooltipLabel: {
    minWidth: 150,
  },
  fab: {
    background: theme.palette.background.default,
    "&:hover": {
      background: theme.palette.secondary.main,
    },
  },
  [theme.breakpoints.up("sm")]: {
    speedDial: {
      bottom: theme.spacing(8),
    },
  },
}));

interface MapAddAction {
  icon: ReactElement<SvgIconProps>;
  name: string;
  action: MapDrawToolbarMode;
}

const actions: MapAddAction[] = [
  {
    icon: <SvgIcon color="primary" component={IconTree} viewBox="0 0 24 32" />,
    name: "common.addTree",
    action: "drawPoint",
  },
];

const MapAddActions: FC<MapAddActionsProps> = ({ onChange }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = (action: string) => {
    handleClose();
    onChange(action);
  };

  return isDesktop ? (
    <Tooltip title={t("common.addTree")}>
      <Fab
        className={classes.speedDial}
        aria-label="add-tree"
        size="small"
        onClick={() => handleAction("drawPoint")}
      >
        <SvgIcon color="primary" component={IconTree} viewBox="0 0 24 32" />
      </Fab>
    </Tooltip>
  ) : (
    <SpeedDial
      ariaLabel="actions-map-editor"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={<Icon>{action.icon}</Icon>}
          tooltipTitle={t(action.name)}
          classes={{ staticTooltipLabel: classes.staticTooltipLabel }}
          tooltipOpen
          onClick={() => handleAction(action.action)}
        />
      ))}
    </SpeedDial>
  );
};

export default MapAddActions;
