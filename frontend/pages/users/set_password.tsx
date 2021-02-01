import { useEffect, useState, ReactNode } from "react";
import Head from "next/head";
import AppLayoutGeneral from "@/components/AppLayout/General";
import {
  TextField,
  Button,
  Grid,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  InputAdornment,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "@/lib/useApi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  baseCard: {
    width: 568,
    background: "transparent",
  },
  baseCardTitle: {
    textAlign: "center",
  },
  [theme.breakpoints.only("xs")]: {
    baseCard: {
      width: "100%",
    },
  },
}));

const BaseCard = ({ children }) => {
  const classes = useStyles();
  const { t } = useTranslation("pages");

  return (
    <Card elevation={0} className={classes.baseCard}>
      <CardHeader
        className={classes.baseCardTitle}
        title={t("pages.UsersSetPassword.title")}
      />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
};

const GoToLogin = () => {
  const router = useRouter();
  const { t } = useTranslation(["pages", "commons"]);

  const handleGoToLogin = () => {
    router.push("/signin");
  };

  return (
    <BaseCard>
      <Grid container justify="center">
        <Grid item>
          <Box mb={3} mt={2}>
            <Typography>{t("pages.UsersSetPassword.success")}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleGoToLogin}
        >
          {t("pages.UsersSetPassword.goToLogin")}
        </Button>
      </Grid>
    </BaseCard>
  );
};

const ResendMail = () => {
  const router = useRouter();
  const { t } = useTranslation(["pages", "commons"]);

  const handleRequestToken = () => {
    router.push("/forgot");
  };

  const handleGoToLogin = () => {
    router.push("/signin");
  };

  return (
    <BaseCard>
      <Grid container justify="center">
        <Grid item>
          <Box mb={2}>
            <Typography>
              {t("pages.UsersSetPassword.tokenHasExpired")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRequestToken}
        >
          {t("pages.UsersSetPassword.requestNewToken")}
        </Button>
      </Grid>
      <Grid item>
        <Button fullWidth onClick={handleGoToLogin}>
          {t("pages.UsersSetPassword.orGoToLogin")}
        </Button>
      </Grid>
    </BaseCard>
  );
};

const PasswordField = ({ name, register, errors, trigger }) => {
  const { t } = useTranslation(["pages", "commons"]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TextField
      inputRef={register}
      name={name}
      id={name}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      required
      fullWidth
      placeholder={t(`pages.UsersSetPassword.${name}`)}
      error={Boolean(errors[name]?.message)}
      helperText={errors[name]?.message}
      onChange={() => {
        trigger(name);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const ChangePasswordForm = ({
  trigger,
  register,
  getValues,
  errors,
  setStatus = (status) => status,
}) => {
  const { t } = useTranslation("pages");
  const [updating, setUpdating] = useState(false);
  const { apiETK } = useApi().api;
  const router = useRouter();

  const handleChangePassword = async () => {
    try {
      setUpdating(true);
      const valid = await trigger();

      if (valid) {
        const payload = {
          new_password: getValues("password"),
        };
        const config = {
          skipAuthRefresh: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${router.query.c}`,
          },
        };

        await apiETK.post("/auth/reset-password/", payload, config);
        setStatus("goToLogin");
      }
    } catch (error) {
      const { response } = error;

      if (response.status === 422) {
        setStatus("tokenInvalid");
      }
    } finally {
      setUpdating(false);
    }
  };

  const propsPasswordField = {
    register,
    errors,
    trigger,
  };

  return (
    <BaseCard>
      <Grid item>
        <Typography>{t("pages.UsersSetPassword.description")}</Typography>
      </Grid>
      <Grid item>
        <PasswordField name="password" {...propsPasswordField} />
      </Grid>
      <Grid item>
        <PasswordField name="passwordConfirmation" {...propsPasswordField} />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          onClick={handleChangePassword}
        >
          {!updating ? (
            t("pages.UsersSetPassword.button")
          ) : (
            <CircularProgress color="secondary" />
          )}
        </Button>
      </Grid>
    </BaseCard>
  );
};

const isNullOrUndefined = function (value) {
  return value === null || value === undefined;
};

export default function UsersSetPasswordPage() {
  const { t } = useTranslation(["pages", "common"]);
  const schema = yup.object().shape({
    password: yup
      .string()
      .min(8, t("common.errors.passwordMin"))
      .max(255)
      .required()
      .test(
        "minOneNumberOrSymbol",
        t("common.errors.passwordMustContainOneNumberOrSymbol"),
        (value) => {
          return (
            isNullOrUndefined(value) ||
            (value.match(/[^a-zA-Z\s]/g) || []).length >= 1
          );
        }
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        t("common.errors.passwordsShouldMatch")
      ),
  });
  const { register, getValues, trigger, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [status, setStatus] = useState("password");
  const [component, setComponent] = useState<ReactNode>();

  useEffect(() => {
    switch (status) {
      case "password":
        setComponent(
          <ChangePasswordForm
            register={register}
            getValues={getValues}
            trigger={trigger}
            errors={errors}
            setStatus={setStatus}
          />
        );
        break;
      case "tokenInvalid":
        setComponent(<ResendMail />);
        break;
      case "goToLogin":
        setComponent(<GoToLogin />);
        break;
    }
  }, [status]);

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("pages.UsersSetPassword.title")}</title>
      </Head>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        {component}
      </Grid>
    </AppLayoutGeneral>
  );
}
