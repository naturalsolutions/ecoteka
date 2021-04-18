import { FC, createContext, useContext } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "calc(100vh - 48px)",
    paddingTop: theme.spacing(1),
  },
}));

const AppLayoutGeneralContext = createContext(null);

export const useAppLayoutGeneral = () => useContext(AppLayoutGeneralContext);

export interface AppLayoutGeneral {
  isLoading?: boolean;
  skeleton?: JSX.Element;
}

const AppLayoutGeneral: FC<AppLayoutGeneral> = ({
  isLoading = false,
  skeleton,
  children,
}) => {
  const classes = useStyles();

  return (
    <AppLayoutGeneralContext.Provider value={{}}>
      {isLoading ? (
        skeleton
      ) : (
        <main className={classes.content}>{children}</main>
      )}
    </AppLayoutGeneralContext.Provider>
  );
};

export default AppLayoutGeneral;
