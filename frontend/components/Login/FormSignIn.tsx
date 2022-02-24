import React, { useState } from "react";
import {
  Grid,
  TextField,
  Link,
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAPI from "@/lib/useApi";
import getConfig from "next/config";
import { useAppContext } from "@/providers/AppContext";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  formWidth: {
    textAlign: "center",
    margin: "0 16px",
    [theme.breakpoints.up("sm")]: {
      width: "450px",
      margin: "0 auto",
    },
  },
}));

type SignInFormValues = {
  username: string;
  password: string;
};

const FormSignIn = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { apiETK } = useAPI().api;
  const { publicRuntimeConfig } = getConfig();
  const { tokenStorage, refreshTokenStorage } = publicRuntimeConfig;
  const { refetchUserData, setOrganization } = useAppContext();
  const router = useRouter();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(t("components.SignIn.errorMessageRequiredField"))
      .email(t("components.SignIn.errorMessageEmail")),
    password: yup
      .string()
      .required(t("components.SignIn.errorMessageRequiredField")),
  });

  const { register, handleSubmit, errors, setError } =
    useForm<SignInFormValues>({
      resolver: yupResolver(schema),
    });
  const handleOnEmailEnter = async (e) => {
    if (e.keyCode == 13) {
      const nextField = document.querySelector("input[name='password']");
      nextField.focus();
    }
  };
  const handleOnPasswordEnter = async (e) => {
    if (e.keyCode == 13) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data?: SignInFormValues) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      const response = await apiETK.post("/auth/login", params, config);
      const { data, status } = response;

      if (status === 200) {
        localStorage.setItem(tokenStorage, data.access_token);
        localStorage.setItem(refreshTokenStorage, data.refresh_token);
        const user = await refetchUserData();

        const { callbackUrl } = router.query;

        if (callbackUrl) {
          setOrganization(undefined);
          return router.back();
        }

        if (user?.organizations?.length === 1) {
          return router.push({
            pathname: "/[organizationSlug]",
            query: {
              organizationSlug: user.organizations[0].slug,
            },
          });
        }

        router.push("/");
        setIsLoading(false);
      }

      return data;
    } catch (error) {
      setError("username", {
        type: "manual",
        message: t("components.SignIn.errorMessageServer"),
      });
      setError("password", {
        type: "manual",
        message: t("components.SignIn.errorMessageServer"),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.formWidth}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <img src="/assets/signin-header.png" />
        </Grid>
        <Grid item>
          <Typography variant="h5" align="center" color="textPrimary">
            <strong>{t("components.SignIn.title")}</strong>
          </Typography>
        </Grid>
        <Grid container direction="column">
          <Grid item>
            <TextField
              name="username"
              margin="dense"
              inputProps={{
                "data-test": "signin-form-username",
              }}
              fullWidth
              label={t("components.SignIn.labelUsername")}
              variant="outlined"
              type="email"
              error={Boolean(errors.username)}
              helperText={errors.username?.message ?? ""}
              inputRef={register}
              onKeyDown={handleOnEmailEnter}
            />
          </Grid>
          <Grid item>
            <TextField
              name="password"
              margin="dense"
              defaultValue=""
              fullWidth
              inputProps={{
                "data-test": "signin-form-password",
              }}
              label={t("components.SignIn.labelPassword")}
              variant="outlined"
              onKeyDown={handleOnPasswordEnter}
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message ?? ""}
              inputRef={register}
            />
          </Grid>

          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Link
                  href="/forgot"
                  color="textPrimary"
                  style={{ textAlign: "right" }}
                >
                  {t("components.SignIn.forgotPassword")}
                </Link>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit(onSubmit)}
                  data-test="signin-form-submit"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={30} /> : "Connexion"}
                </Button>
              </Grid>
              <Grid item>
                <Typography variant="h6" align="center" color="textPrimary">
                  {t("components.SignIn.noAccount")}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  fullWidth
                  variant="outlined"
                  href="https://www.natural-solutions.eu/creation-de-compte-ecoteka"
                  target="_blank"
                >
                  {t("components.SignIn.accountRequest")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormSignIn;
