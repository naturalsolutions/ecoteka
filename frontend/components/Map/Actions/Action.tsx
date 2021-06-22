import { FC, ReactElement } from "react";
import {
  makeStyles,
  SvgIconProps,
  Theme,
  Icon,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { SpeedDialAction } from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";

import { useTranslation } from "react-i18next";

export interface MapActionsActionProps {
  icon: ReactElement<SvgIconProps>;
  name: string;
  isActive: boolean;
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
  name,
  icon,
  onClick,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tooltip title={name}>
      <IconButton className={classes.root} aria-label={name} onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default MapActionsAction;
