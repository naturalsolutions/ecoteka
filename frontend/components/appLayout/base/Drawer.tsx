import { FC } from "react";
import { Drawer, IconButton, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export interface IAppLayoutDrawerProps {
  width?: number | string;
  anchor?: "left" | "top" | "right" | "bottom";
  hasCloseIcon?: boolean;
  onClose?(): void;
}

const AppLayoutDrawer: FC<IAppLayoutDrawerProps> = ({
  children,
  anchor = "left",
  width = 300,
  hasCloseIcon = false,
  onClose,
}) => {
  const classes = makeStyles((theme) => ({
    drawer: { flexShrink: 0, width: width, position: "relative" },
    paper: {
      paddingTop: 50,
      width: width,
    },
    content: {
      padding: "1rem",
    },
    closeIcon: {
      position: "absolute",
      right: 5,
      top: 60,
    },
  }))();

  return (
    <Drawer
      className={classes.drawer}
      PaperProps={{
        className: classes.paper,
      }}
      variant="permanent"
      anchor={anchor}
    >
      {hasCloseIcon && (
        <IconButton
          size="small"
          className={classes.closeIcon}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
      <div className={classes.content}>{children}</div>
    </Drawer>
  );
};

export default AppLayoutDrawer;
