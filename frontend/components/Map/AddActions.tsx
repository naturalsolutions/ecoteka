import { FC, ReactElement, useState } from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  SvgIconProps,
  SvgIcon,
  Icon,
} from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import IconTree from "@/public/assets/icons/icon_tree.svg";
import { TMapDrawToolbarMode } from "@/components/Map/DrawToolbar";
import { useTranslation } from "react-i18next";

export interface MapAddActionsProps {
  onChange(action: string);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    staticTooltipLabel: {
      minWidth: 150,
    },
  })
);

interface MapAddAction {
  icon: ReactElement<SvgIconProps>;
  name: string;
  action: TMapDrawToolbarMode;
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

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
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
