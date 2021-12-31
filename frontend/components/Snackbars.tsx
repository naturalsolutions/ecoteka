import React, { forwardRef, useImperativeHandle } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Alert, Color } from "@material-ui/lab";
import { TransitionProps } from "@material-ui/core/transitions";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5),
    },
  })
);

export interface SnackbarMessage {
  message: string;
  anchorOrigin?: SnackbarOrigin;
  severity?: Color;
  key?: number;
  autoHideDuration?: number;
}

export interface State {
  open: boolean;
  snackPack: SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

export const Snackbars = forwardRef((props, ref) => {
  const [snackPack, setSnackPack] = React.useState<SnackbarMessage[]>([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  useImperativeHandle(ref, () => ({
    open: (openProps: SnackbarMessage) => {
      setSnackPack((prev) => [
        ...prev,
        {
          message: openProps.message,
          key: new Date().getTime(),
          anchorOrigin: Object.assign(
            {},
            {
              vertical: "top",
              horizontal: "center",
            },
            openProps.anchorOrigin
          ),
          severity: openProps.severity || "info",
          autoHideDuration: openProps.autoHideDuration,
        },
      ]);
    },
  }));

  const classes = useStyles();
  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      anchorOrigin={messageInfo ? messageInfo.anchorOrigin : undefined}
      open={open}
      autoHideDuration={messageInfo ? messageInfo.autoHideDuration : 6000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    >
      <Alert onClose={handleClose} severity={messageInfo?.severity}>
        {messageInfo ? messageInfo.message : ""}
      </Alert>
    </Snackbar>
  );
});

export default Snackbars;
