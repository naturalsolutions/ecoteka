import {
  FC,
  createContext,
  useContext,
  ReactNode,
  forwardRef,
  useRef,
  useEffect,
  useState,
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
import { Error } from "@/index";
import ErrorComponent from "@/components/Core/Error";
import { useRouter } from "next/router";

interface AppLayoutCartoProps {
  height: number | string;
  width: number | string;
  dataTest: string;
}

const useStyles = makeStyles<Theme, AppLayoutCartoProps>((theme) => ({
  dialogTitle: {
    padding: 0,
  },
  dialogTitlePadding: {},
  content: {
    position: "relative",
    backgroundColor: theme.palette.background.default,
    height: (props) => props.height,
    width: (props) => props.width,
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
  isLoading?: boolean;
  skeleton?: JSX.Element;
  error?: Error | undefined;
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
  withoutContent?: boolean;
  titleNoPadding?: boolean;
}

export const AppLayoutCartoDialog: FC<AppLayoutCartoDialogProps> = ({
  title,
  children,
  actions,
  titleNoPadding = false,
  withoutContent = false,
}) => {
  const { theme } = useThemeContext();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const { height, width, container } = useAppLayoutCarto();
  const classes = useStyles({ height: height - 500, width });

  return !isDesktop ? (
    <Dialog fullScreen open={true} TransitionComponent={Transition}>
      {withoutContent ? (
        children
      ) : (
        <>
          {title && (
            <DialogTitle className={titleNoPadding ? classes.dialogTitle : ""}>
              {title}
            </DialogTitle>
          )}
          <DialogContent>{children}</DialogContent>
        </>
      )}
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
        {withoutContent ? (
          children
        ) : (
          <>
            {title && (
              <DialogTitle
                className={titleNoPadding ? classes.dialogTitle : ""}
              >
                {title}
              </DialogTitle>
            )}
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
          </>
        )}
      </Drawer>
    </Portal>
  );
};

const AppLayoutCarto: FC<IAppLayoutCarto> = ({
  drawerLeftWidth,
  isLoading = false,
  error,
  skeleton,
  children,
}) => {
  const toolbarHeight = 48;
  const vh = use100vh();
  const appHeight = vh - toolbarHeight;
  const container = useRef(null);
  const classes = useStyles({
    height: appHeight,
    width: drawerLeftWidth,
  });
  const router = useRouter();
  const [calculatedWidth, setCalculatedWidth] = useState<string | number>(
    drawerLeftWidth
  );

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <AppLayoutCartoContext.Provider
      value={{ hegiht: appHeight, width: drawerLeftWidth, container }}
    >
      {error && <ErrorComponent errorCode={error.code} />}
      {isLoading && skeleton}
      {!error && !isLoading && (
        <div style={{ display: "flex" }}>
          <div ref={container}></div>
          <main className={classes.content}>{children}</main>
        </div>
      )}
    </AppLayoutCartoContext.Provider>
  );
};

export default AppLayoutCarto;
