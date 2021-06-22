import React, { FC, Children, useState, ReactNode, ReactElement } from "react";
import {
  Backdrop,
  Fab,
  Grid,
  makeStyles,
  Theme,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import { MapActionsActionProps } from "./Action";

export interface MapActionsListProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  staticTooltipLabel: {
    display: "inline",
    minWidth: 225,
    textAlign: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.speedDial - 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  fab: {
    background: theme.palette.background.default,
    "&:hover": {
      background: theme.palette.grey[200],
    },
  },
  [theme.breakpoints.up("sm")]: {
    speedDial: {
      bottom: theme.spacing(8),
    },
  },
}));

const MapActionsList: FC<MapActionsListProps> = ({ children }) => {
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

  const handleOnClick = (onClick?: () => void) => {
    onClick();
    handleClose();
  };

  return isDesktop ? (
    <Grid
      container
      className={classes.root}
      direction="column-reverse"
      justify="flex-end"
      alignItems="flex-end"
      spacing={2}
    >
      {Children.map(children, (child: ReactElement<MapActionsActionProps>) => (
        <Grid item>
          <Tooltip title={child.props.name} arrow placement="left">
            <Fab
              size="small"
              color="primary"
              className={classes.fab}
              aria-label={child.props.name}
              onClick={child.props.onClick}
            >
              {child.props.icon}
            </Fab>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  ) : (
    <>
      <Backdrop open={open} className={classes.backdrop} />
      <SpeedDial
        ariaLabel="actions-map-editor"
        className={classes.root}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {Children.map(
          children,
          (child: ReactElement<MapActionsActionProps>) => (
            <SpeedDialAction
              key={child.props.name}
              icon={child.props.icon}
              classes={{
                staticTooltipLabel: classes.staticTooltipLabel,
              }}
              tooltipTitle={child.props.name}
              tooltipOpen
              onClick={() => handleOnClick(child.props.onClick)}
            />
          )
        )}
      </SpeedDial>
    </>
  );
};

export default MapActionsList;
