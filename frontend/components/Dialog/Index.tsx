import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  PropTypes,
} from "@material-ui/core";

export type ETKDialogActions = {
  open: (title: string, content: string, actions: ETKDialogAction[]) => void;
  close: () => void;
};

export interface ETKDialogAction {
  action?: () => void;
  color?: PropTypes.Color;
  label: string;
  noClose: boolean;
}

export interface ETKDialogProps {
  styleDialog?: object;
}

export const ETKDialog = forwardRef<ETKDialogActions, ETKDialogProps>(
  ({ styleDialog }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [actions, setActions] = useState<ETKDialogAction[]>([]);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string | React.ReactNode>("");

    const onActionClick = (e, action) => {
      if (action.action) {
        action.action(e);
      }

      if (!action.noClose) {
        setIsOpen(false);
      }
    };

    const renderActions = actions.map((action, idx) => (
      <Button
        variant="contained"
        color={action.color ? action.color : "default"}
        key={idx}
        onClick={(e) => onActionClick(e, action)}
      >
        {action.label}
      </Button>
    ));

    useImperativeHandle(ref, () => ({
      open: (
        newTitle: string,
        newContent: string | React.ReactNode,
        newActions: ETKDialogAction[]
      ) => {
        setTitle(newTitle);
        setContent(newContent);
        setActions(newActions);
        setIsOpen(true);
      },
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <Dialog open={isOpen} style={styleDialog}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>{renderActions}</DialogActions>
      </Dialog>
    );
  }
);

export default ETKDialog;
