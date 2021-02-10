import { FC, createContext, useContext, ReactNode } from "react";
import { makeStyles, Drawer } from "@material-ui/core";
import { TMapToolbarAction } from "@/components/Map/Toolbar";

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
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
    },
  },

  drawerLeftPaper: {
    // @ts-ignore
    width: (props) => props.drawerLeftWidth,
    padding: "1rem",
    height: toolbarHeightCalc,
    marginTop: toolbarHeight,
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
          </Drawer>
        )}
        <main className={classes.content}>{children}</main>
      </div>
    </AppLayoutCartoContext.Provider>
  );
};

export default AppLayoutCarto;
