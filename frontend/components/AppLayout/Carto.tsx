import {
  FC,
  createContext,
  useContext,
  ReactNode,
  forwardRef,
  useRef,
} from "react";
import {
  makeStyles,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Theme,
  Portal,
} from "@material-ui/core";
import { TMapToolbarAction } from "@/components/Map/Toolbar";
import { use100vh } from "react-div-100vh";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useThemeContext } from "@/lib/hooks/useThemeSwitcher";
import { TransitionProps } from "@material-ui/core/transitions";

interface AppLayoutCartoProps {
  height: number;
  width: number;
}

const useStyles = makeStyles<Theme, AppLayoutCartoProps>((theme) => ({
  content: {
    position: "relative",
    backgroundColor: theme.palette.background.default,
    height: (props) => props.height,
    flexGrow: 1,
  },
  drawerLeft: {
    width: (props) => props.width,
    height: (props) => props.height,
    flexShrink: 0,
  },
  drawerLeftPaper: {
    width: (props) => props.width,
    height: `calc(100% - 48px)`,
    marginTop: 48,
  },
}));

const AppLayoutCartoContext = createContext(null);

export const useAppLayoutCarto = () => useContext(AppLayoutCartoContext);

export interface IAppLayoutCarto {
  drawerLeftComponent?: ReactNode;
  drawerLeftWidth?: number;
  onMapToolbarChange?(action: TMapToolbarAction): void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface AppLayoutCartoDialogProps {
  title?: string | React.ReactElement;
  actions?: React.ReactElement;
}

export const AppLayoutCartoDialog: FC<AppLayoutCartoDialogProps> = ({
  title,
  children,
  actions,
}) => {
  const { theme } = useThemeContext();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const { height, width, container } = useAppLayoutCarto();
  const classes = useStyles({ height: height - 500, width });

  return !isDesktop ? (
    <Dialog fullScreen open={true} TransitionComponent={Transition}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  ) : (
    <Portal container={container.current}>
      <Drawer
        anchor="left"
        className={classes.drawerLeft}
        open={true}
        variant="permanent"
        PaperProps={{
          elevation: 0,
          className: classes.drawerLeftPaper,
        }}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Drawer>
    </Portal>
  );
};

const AppLayoutCarto: FC<IAppLayoutCarto> = ({
  children,
  drawerLeftWidth = 400,
}) => {
  const toolbarHeight = 48;
  const vh = use100vh();
  const appHeight = vh - toolbarHeight;
  const container = useRef(null);
  const classes = useStyles({
    height: appHeight,
    width: drawerLeftWidth,
  });

  return (
    <AppLayoutCartoContext.Provider
      value={{ hegiht: appHeight, width: drawerLeftWidth, container }}
    >
      <div style={{ display: "flex" }}>
        <div ref={container}></div>
        <main className={classes.content}>{children}</main>
      </div>
    </AppLayoutCartoContext.Provider>
  );
};

export default AppLayoutCarto;
