import { FC, createContext, useContext, ReactNode } from "react";
import { makeStyles, Drawer } from "@material-ui/core";
import { TMapToolbarAction } from "@/components/Map/Toolbar";
import { use100vh } from "react-div-100vh";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    backgroundColor: theme.palette.background.default,
    height: (props) => props.appHeight,
    flexGrow: 1,
  },
  drawerLeft: {
    // @ts-ignore
    width: (props) => props.drawerLeftWidth,
    height: (props) => props.appHeight,
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
    },
  },

  drawerLeftPaper: {
    // @ts-ignore
    width: (props) => props.drawerLeftWidth,
    padding: "1rem",
    height: (props) => props.appHeight,
    marginTop: 48,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
    },
  },
}));

const AppLayoutCartoContext = createContext(null);

export const useAppLayoutCarto = () => useContext(AppLayoutCartoContext);

export interface IAppLayoutCarto {
  drawerLeftComponent?: ReactNode;
  drawerLeftWidth?: number;
  onMapToolbarChange?(action: TMapToolbarAction): void;
}

const AppLayoutCarto: FC<IAppLayoutCarto> = ({
  children,
  drawerLeftWidth = 400,
  drawerLeftComponent,
}) => {
  const toolbarHeight = 48;
  const vh = use100vh();
  const appHeight = vh - toolbarHeight;
  const classes = useStyles({
    drawerLeftWidth,
    appHeight,
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
          </Drawer>
        )}
        <main className={classes.content}>{children}</main>
      </div>
    </AppLayoutCartoContext.Provider>
  );
};

export default AppLayoutCarto;
