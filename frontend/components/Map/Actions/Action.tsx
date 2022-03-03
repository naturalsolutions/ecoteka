import { FC, ReactElement, useEffect } from "react";
import {
  makeStyles,
  SvgIconProps,
  Theme,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";

export interface MapActionsActionProps {
  dataTest?: string;
  name: string;
  icon: ReactElement<SvgIconProps>;
  isActive: boolean;
  action?: Actions;
  subject?: Subjects;
  onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  staticTooltipLabel: {
    minWidth: 150,
  },
}));

const MapActionsAction: FC<MapActionsActionProps> = ({
  isActive = false,
  action = "preview",
  subject = "Trees",
  dataTest = "",
  icon,
  name,
  onClick,
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={name}>
      <IconButton className={classes.root} aria-label={name} onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default MapActionsAction;
