import React, {
  FC,
  Children,
  useState,
  ReactElement,
  cloneElement,
  useRef,
} from "react";
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
import { MapActionsActionProps } from "./Action";
import { useEffect } from "react";

export interface MapActionsListProps {}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    width: "auto",
  },
  container: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  backdrop: {
    zIndex: theme.zIndex.speedDial - 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100vw",
  },
}));

const MapActionsList: FC<MapActionsListProps> = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [childrenWithProps, setChildrenWithProps] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const newChildrenWithProps = Children.map(children, (child, index) => {
      return cloneElement(child, {
        open,
      });
    });

    setChildrenWithProps(newChildrenWithProps);
  }, [open]);

  return (
    <>
      <Backdrop open={!isDesktop && open} className={classes.backdrop} />
      <SpeedDial
        hidden={isDesktop}
        ariaLabel="actions-map-editor"
        className={classes.root}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={isDesktop || open}
      >
        {childrenWithProps}
      </SpeedDial>
    </>
  );
};

export default MapActionsList;
