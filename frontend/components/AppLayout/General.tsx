import { FC, createContext, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Footer from "@/components/AppLayout/Footer";
import ErrorComponent from "@/components/Core/Error";
import { useRouter } from "next/router";
import { Error } from "@/index";

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    minHeight: "calc(100vh - 48px)",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
}));

const AppLayoutGeneralContext = createContext(null);

export const useAppLayoutGeneral = () => useContext(AppLayoutGeneralContext);

export interface IAppLayoutGeneral {
  isLoading?: boolean;
  hasFooter?: boolean;
  error?: Error | undefined;
  skeleton?: JSX.Element;
}

const AppLayoutGeneral: FC<IAppLayoutGeneral> = ({
  isLoading = false,
  error = undefined,
  hasFooter = true,
  skeleton,
  children,
}) => {
  const classes = useStyles();
  const router = useRouter();

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <AppLayoutGeneralContext.Provider value={{}}>
      {error && <ErrorComponent errorCode={error.code} />}
      {isLoading && skeleton}
      {!error && !isLoading && (
        <main className={classes.content}>{children}</main>
      )}
      {hasFooter && <Footer />}
    </AppLayoutGeneralContext.Provider>
  );
};

export default AppLayoutGeneral;
