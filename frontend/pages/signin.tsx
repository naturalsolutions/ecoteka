import { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import ETKFormSignIn, { ETKFormSignInActions } from "@/components/SignIn/Form";
import { useRouter } from "next/router";
import Head from "next/head";
import AppLayoutGeneral from "@/components/AppLayout/General";

const useStyles = makeStyles((theme) => ({
  formWidth: {
    width: "80%",
    [theme.breakpoints.up(780)]: {
      width: "450px",
    },
  },
  h5: {
    fontWeight: 600,
  },
}));

export default function SignInPage() {
  const classes = useStyles();
  const formRef = useRef<ETKFormSignInActions>();
  const { t } = useTranslation("components");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);

    if (isOk) {
      router.push("/map/");
    }
  };

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka - Sign In</title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        <Box flexGrow={1} />
        <Box>
          <img src="/assets/signin-header.png" />
        </Box>
        <Box mb={2}>
          <Typography
            variant="h5"
            align="center"
            color="textPrimary"
            className={classes.h5}
          >
            {t("SignIn.title")}
          </Typography>
        </Box>
        <Box className={classes.formWidth}>
          <ETKFormSignIn ref={formRef}></ETKFormSignIn>
        </Box>
        <Box mb={3}>
          <Link
            href="/forgot"
            color="textPrimary"
            style={{ textAlign: "right" }}
          >
            {t("SignIn.forgotPassword")}
          </Link>
        </Box>
        <Button
          color="primary"
          variant="contained"
          onClick={onSubmit}
          disabled={isLoading}
          className={classes.formWidth}
        >
          {isLoading ? <CircularProgress size={30} /> : "Connexion"}
        </Button>
        <Box my={2}>
          <Typography variant="h6" align="center" color="textPrimary">
            {t("SignIn.noAccount")}
          </Typography>
        </Box>
        <Button
          color="primary"
          variant="outlined"
          href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
          target="_blank"
          className={classes.formWidth}
        >
          {t("SignIn.accountRequest")}
        </Button>
        <Box flexGrow={1} />
      </Grid>
    </AppLayoutGeneral>
  );
}
