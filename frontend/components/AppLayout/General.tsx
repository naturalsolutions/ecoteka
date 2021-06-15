import { FC, createContext, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Footer from "@/components/AppLayout/Footer";
import Error from "@/components/Core/Error";
import { useRouter } from "next/router";

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

interface Error {
  message: string;
  code: number;
}

export interface IAppLayoutGeneral {
  isLoading?: boolean;
  error?: Error | undefined;
  skeleton?: JSX.Element;
}

const AppLayoutGeneral: FC<IAppLayoutGeneral> = ({
  isLoading = false,
  error = undefined,
  skeleton,
  children,
}) => {
  const classes = useStyles();
  const router = useRouter();

  const handleGoToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <AppLayoutGeneralContext.Provider value={{}}>
      {error && (
        <Error
          errorCode={error.code}
          errorMessage={error.message}
          captionText={error.message}
          buttonText="Back to homepage"
          onClick={handleGoToHome}
        />
      )}
      {isLoading && skeleton}
      {!error && !isLoading && (
        <main className={classes.content}>{children}</main>
      )}
      <Footer />
    </AppLayoutGeneralContext.Provider>
  );
};

export default AppLayoutGeneral;
