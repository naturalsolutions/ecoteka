import { FC, useState } from "react";
import { makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

export interface MapActionsListProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  container: {
    display: "flex",
    flexDirection: "column",
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

  return isDesktop ? (
    <div className={[classes.root, classes.container].join(" ")}>
      {children}
    </div>
  ) : (
    <SpeedDial
      ariaLabel="actions-map-editor"
      className={classes.root}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {children}
    </SpeedDial>
  );
};

export default MapActionsList;
