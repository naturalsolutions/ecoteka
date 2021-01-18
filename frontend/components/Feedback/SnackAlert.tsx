import React, { SyntheticEvent, useEffect } from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import MuiAlert, { Color } from "@material-ui/lab/Alert";

export interface SnackAlertProps {
  open: boolean;
  severity: Color;
  message: string;
  anchorOrigin: SnackbarOrigin;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackAlert: React.FC<SnackAlertProps> = ({
  open,
  severity,
  message = "",
  anchorOrigin,
}) => {
  const [isOpen, setIsOpen] = React.useState(open);
  const handleClose = (
    event: SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackAlert;
