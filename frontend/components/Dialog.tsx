import React, { useState, forwardRef, useImperativeHandle } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from "@material-ui/core";

export type ETKDialogActions = {
  open: (openProps: ETKDialogProps) => void;
  close: () => void;
};

export interface ETKDialogAction {
  label: string;
  noClose?: boolean;
  onClick?: () => void;
}

export interface ETKDialogProps {
  title?: string;
  content?: string;
  actions?: ETKDialogAction[];
  dialogProps?: DialogProps;
}

const defaultProps: ETKDialogProps = {
  title: "",
  content: "",
  actions: [],
};

export const ETKDialog = forwardRef<ETKDialogActions, ETKDialogProps>(
  (props, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [actions, setActions] = useState<ETKDialogAction[]>(props.actions);
    const [title, setTitle] = useState<string>(props.title);
    const [content, setContent] = useState<string | React.ReactNode>(
      props.content
    );
    const [dialogProps, setDialogProps] = useState<DialogProps>(
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

    const renderActions = actions.map((action, idx) => {
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

    useImperativeHandle(ref, () => ({
      open: (openProps: ETKDialogProps) => {
        setTitle(openProps.title);
        setContent(openProps.content);
        setActions(openProps.actions);
        setDialogProps(openProps.dialogProps);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} {...dialogProps}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>{renderActions}</DialogActions>
      </Dialog>
    );
  }
);

ETKDialog.defaultProps = defaultProps;

export default ETKDialog;
