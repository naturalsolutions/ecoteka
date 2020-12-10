import { FC } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import Header from "@/components/appLayout/base/Header";
import Drawer from "@/components/appLayout/base/Drawer";

const drawerWidth = 240;

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

const AppLayoutEditor: FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header className={classes.appBar} />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

export default AppLayoutEditor;
