import { FC, ReactNode } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import MapGL, { GeolocateControl } from "@urbica/react-map-gl";
import Header from "@/components/appLayout/base/Header";
import Drawer, {
  IAppLayoutDrawerProps,
} from "@/components/appLayout/base/Drawer";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { IOrganization, IUser } from "@/index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      height: 50,
    },
    content: {
      position: "relative",
      marginTop: 50,
      flexGrow: 1,
    },
  })
);

export interface IAppLayoutEditorActionPanelProps {
  map: MapGL;
  geolocate: GeolocateControl;
  organization: IOrganization;
  user: IUser;
  selection?: [];
  onChangeActivePanel?(node: ReactNode): void;
}

interface IAppLayoutEditor {
  drawerLeft?: ReactNode;
  drawerLeftProps?: IAppLayoutDrawerProps;
  drawerRight?: ReactNode;
  toolbar?: ReactNode;
  onCloseDrawerLeft?(): void;
}

const AppLayoutEditor: FC<IAppLayoutEditor> = ({
  drawerLeft,
  drawerLeftProps,
  drawerRight,
  toolbar,
  children,
  onCloseDrawerLeft,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header className={classes.appBar} />
      {drawerLeft && (
        <Drawer
          anchor="left"
          {...drawerLeftProps}
          hasCloseIcon
          onClose={onCloseDrawerLeft}
        >
          {drawerLeft}
        </Drawer>
      )}
      <main className={classes.content}>
        {children}
        {toolbar}
      </main>
      {drawerRight && <Drawer anchor="right">{drawerRight}</Drawer>}
    </div>
  );
};

export default AppLayoutEditor;
