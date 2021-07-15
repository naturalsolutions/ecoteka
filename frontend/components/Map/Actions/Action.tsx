import { FC, forwardRef, ReactElement } from "react";
import {
  makeStyles,
  SvgIconProps,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Can from "@/components/Can";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";
import { SpeedDialAction } from "@material-ui/lab";

export interface MapActionsActionProps {
  name?: string;
  icon?: ReactElement<SvgIconProps>;
  open?: boolean;
  isActive?: boolean;
  action?: Actions;
  subject?: Subjects;
  onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  staticTooltipLabel: {
    display: "inline",
    minWidth: 225,
    textAlign: "center",
  },
  staticTooltipLabelActive: {
    display: "inline",
    minWidth: 225,
    textAlign: "center",
    color: theme.palette.primary.light,
  },
  fab: {
    background: theme.palette.background.default,
    "&:hover": {
      background: theme.palette.grey[200],
    },
  },
  fabActive: {
    background: theme.palette.primary.light,
    "&:hover": {
      background: theme.palette.primary.dark,
    },
  },
  [theme.breakpoints.up("sm")]: {
    speedDial: {
      bottom: theme.spacing(8),
    },
  },
}));

const MapActionsAction: FC<MapActionsActionProps> = ({
  isActive = false,
  action = "read",
  subject = "Trees",
  icon,
  open = false,
  name,
  onClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Can do={action} on={subject}>
      <SpeedDialAction
        icon={icon}
        open={open}
        classes={{
          staticTooltipLabel: isActive
            ? classes.staticTooltipLabelActive
            : classes.staticTooltipLabel,
          fab: isActive ? classes.fabActive : classes.fab,
        }}
        tooltipTitle={name}
        tooltipOpen={!isDesktop && open}
        onClick={handleOnClick}
      />
    </Can>
  );
};

export default MapActionsAction;
