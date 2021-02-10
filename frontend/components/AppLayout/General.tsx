import { FC, createContext, useContext } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    minHeight: "calc(100vh - 48px)",
    padding: "1rem",
  },
}));

const AppLayoutGeneralContext = createContext(null);

export const useAppLayoutGeneral = () => useContext(AppLayoutGeneralContext);

export interface IAppLayoutGeneral {}

const AppLayoutGeneral: FC<IAppLayoutGeneral> = ({ children }) => {
  const classes = useStyles();

  return (
    <AppLayoutGeneralContext.Provider value={{}}>
      <main className={classes.content}>{children}</main>
    </AppLayoutGeneralContext.Provider>
  );
};

export default AppLayoutGeneral;
