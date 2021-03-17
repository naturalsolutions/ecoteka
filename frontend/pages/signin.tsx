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
import FormSignIn, { FormSignInActions } from "@/components/SignIn/Form";
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
  const formRef = useRef<FormSignInActions>();
  const { t } = useTranslation("components");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);

    if (isOk) {
      // TODO if user doesn't belong to an existing organization, one's should be redirected to account page (wip)
      // router.push("/account")
      router.push("/");
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
            {t("components.SignIn.title")}
          </Typography>
        </Box>
        <Box className={classes.formWidth}>
          <FormSignIn ref={formRef} onSubmit={onSubmit} />
        </Box>
        <Box mb={3}>
          <Link
            href="/forgot"
            color="textPrimary"
            style={{ textAlign: "right" }}
          >
            {t("components.SignIn.forgotPassword")}
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
            {t("components.SignIn.noAccount")}
          </Typography>
        </Box>
        <Button
          color="primary"
          variant="outlined"
          href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
          target="_blank"
          className={classes.formWidth}
        >
          {t("components.SignIn.accountRequest")}
        </Button>
        <Box flexGrow={1} />
      </Grid>
    </AppLayoutGeneral>
  );
}
