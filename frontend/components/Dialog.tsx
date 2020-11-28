import React, { useState, forwardRef, useImperativeHandle } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Paper,
  makeStyles,
} from "@material-ui/core";

import Draggable from "react-draggable";

export type ETKDialogActions = {
  open: (openProps: ETKDialogProps) => void;
  close: () => void;
};

export interface ETKDialogAction {
  label: string;
  noClose?: boolean;
  onClick?: () => void;
}

export interface ETKDialogPropsDialogProps {
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disablePortal?: boolean;
  container?: HTMLElement | React.Component;
}

export interface ETKDialogProps {
  title?: string;
  content?: string | React.ReactNode;
  actions?: ETKDialogAction[];
  dialogProps?: ETKDialogPropsDialogProps;
  isDraggable?: boolean;
}

const defaultProps: ETKDialogProps = {
  title: "",
  content: "",
  actions: [],
};

const DraggablePaperComponent = (props) => {
  return (
    <Draggable handle="#etk-dialog" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const PaperComponent = (props) => {
  return <Paper {...props} />;
};

const useStyles = makeStyles(() => ({
  root: {
    pointerEvents: "none",
  },
  paper: {
    pointerEvents: "all",
  },
}));

export const ETKDialog = forwardRef<ETKDialogActions, ETKDialogProps>(
  (props, ref) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [actions, setActions] = useState<ETKDialogAction[]>(props.actions);
    const [title, setTitle] = useState<string>(props.title);
    const [isDraggable, setIsDraggable] = useState<boolean>(props.isDraggable);
    const [content, setContent] = useState<string | React.ReactNode>(
      props.content
    );
    const [dialogProps, setDialogProps] = useState<ETKDialogPropsDialogProps>(
      props.dialogProps
    );

    const onActionClick = (e, action) => {
      if (action.onClick) {
        action.onClick(e);
      }

      if (!action.noClose) {
        setIsOpen(false);
      }
    };

    const renderActions = () => {
      return actions.map((action, idx) => {
        const { onClick, label, noClose, ...buttonProps } = action;
        return (
          <Button
            {...buttonProps}
            key={idx}
            onClick={(e) => onActionClick(e, action)}
          >
            {label}
          </Button>
        );
      });
    };

    useImperativeHandle(ref, () => ({
      isOpen: () => {
        return isOpen;
      },
      open: (openProps: ETKDialogProps) => {
        setTitle(openProps.title);
        setContent(openProps.content);
        setActions(openProps.actions);
        setIsDraggable(openProps.isDraggable);
        setDialogProps(openProps.dialogProps);
        setIsOpen(true);
      },
      displayFullScreen: (activate: boolean) => {
        setDialogProps({ ...dialogProps, fullScreen: activate });
        setIsDraggable(!activate);
      },
      setContent: (content: string | React.ReactNode) => {
        setContent(content);
      },
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        {...dialogProps}
        aria-labelledby="etk-dialog"
        PaperComponent={isDraggable ? DraggablePaperComponent : PaperComponent}
        classes={{
          root: classes.root,
          paper: classes.paper,
        }}
      >
        <DialogTitle id="etk-dialog">{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        {actions && actions.length > 0 && (
          <DialogActions>{renderActions()}</DialogActions>
        )}
      </Dialog>
    );
  }
);

ETKDialog.defaultProps = defaultProps;

export default ETKDialog;
