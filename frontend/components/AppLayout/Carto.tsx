import { FC, createContext, useContext, ReactNode } from "react";
import { makeStyles, Drawer, IconButton } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import MapToolbar, { TMapToolbarAction } from "@/components/Map/Toolbar";
import CloseIcon from "@material-ui/icons/Close";

const toolbarHeight = 48;
const toolbarHeightCalc = `calc(100vh - ${toolbarHeight}px)`;

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    backgroundColor: theme.palette.background.default,
    height: toolbarHeightCalc,
    flexGrow: 1,
  },
  drawerLeft: {
    // @ts-ignore
    width: (props) => props.drawerLeftWidth,
    height: toolbarHeightCalc,
    flexShrink: 0,
  },
  drawerLeftPaper: {
    // @ts-ignore
    width: (props) => props.drawerLeftWidth,
    padding: "1rem",
    height: toolbarHeightCalc,
    marginTop: toolbarHeight,
  },
  drawerRight: {
    marginRight: 55,
    marginTop: toolbarHeight,
    height: toolbarHeightCalc,
  },
  drawerRightModal: {
    pointerEvents: "none",
  },
  drawerRightPaper: {
    pointerEvents: "all",
    minWidth: 200,
    padding: "1rem",
    backgroundColor: fade(theme.palette.background.default, 0.6),
    marginRight: 55,
    height: toolbarHeightCalc,
    marginTop: toolbarHeight,
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

const AppLayoutCartoContext = createContext(null);

export const useAppLayoutCarto = () => useContext(AppLayoutCartoContext);

export interface IAppLayoutCarto {
  drawerRightComponent?: ReactNode;
  drawerLeftComponent?: ReactNode;
  drawerLeftWidth?: number;
  onDrawerLeftClose?(): void;
  onMapToolbarChange?(action: TMapToolbarAction): void;
}

const AppLayoutCarto: FC<IAppLayoutCarto> = ({
  children,
  drawerRightComponent,
  drawerLeftWidth = 400,
  drawerLeftComponent,
  onDrawerLeftClose,
  onMapToolbarChange,
}) => {
  const classes = useStyles({
    drawerLeftWidth,
  });

  return (
    <AppLayoutCartoContext.Provider value={{}}>
      <div style={{ display: "flex" }}>
        {drawerLeftComponent && (
          <Drawer
            anchor="left"
            className={classes.drawerLeft}
            open={Boolean(drawerLeftComponent)}
            variant="permanent"
            PaperProps={{
              elevation: 0,
              className: classes.drawerLeftPaper,
            }}
          >
            {drawerLeftComponent}
            <IconButton
              className={classes.close}
              size="small"
              onClick={onDrawerLeftClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Drawer>
        )}
        <main className={classes.content}>
          {children}
          <MapToolbar onChange={onMapToolbarChange} />
          <Drawer
            open={Boolean(drawerRightComponent)}
            hideBackdrop
            anchor="right"
            variant="temporary"
            className={classes.drawerRight}
            ModalProps={{
              className: classes.drawerRightModal,
            }}
            PaperProps={{
              elevation: 0,
              className: classes.drawerRightPaper,
            }}
          >
            {drawerRightComponent}
          </Drawer>
        </main>
      </div>
    </AppLayoutCartoContext.Provider>
  );
};

export default AppLayoutCarto;
