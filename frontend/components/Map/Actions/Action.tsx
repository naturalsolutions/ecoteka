import { FC, ReactElement } from "react";
import {
  makeStyles,
  SvgIconProps,
  Theme,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Can from "@/components/Can";
import { Actions, Subjects } from "@/abilities/genericOrganizationAbility";

export interface MapActionsActionProps {
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
  action = "read",
  subject = "Trees",
  icon,
  name, 
  onClick
}) => {
  const classes = useStyles();

  return (
    <Can do={action} on={subject}>
      <Tooltip title={name}>
        <IconButton
          className={classes.root}
          aria-label={name}
          onClick={onClick}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Can>
  );
};

export default MapActionsAction;
