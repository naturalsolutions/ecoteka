import { useState } from "react";
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
} from "@material-ui/core";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "@/lib/useApi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  baseCard: {
    width: 568,
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
    <Card className={classes.baseCard}>
      <CardHeader title={t("UsersSetPassword.title")} />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
};

const Updated = () => {
  const router = useRouter();

  const handleBack = () => {
    // router.push("/signin");
  };

  return (
    <BaseCard>
      <Grid container justify="center">
        <Grid item>cambiado</Grid>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleBack}
        >
          Volver
        </Button>
      </Grid>
    </BaseCard>
  );
};

const ChangePasswordForm = ({
  token,
  trigger,
  register,
  getValues,
  errors,
  setIsPasswordUpdate,
}) => {
  const { t } = useTranslation("pages");
  const [updating, setUpdating] = useState(false);
  const { apiETK } = useApi().api;

  const handleChangePassword = async () => {
    try {
      setUpdating(true);
      const valid = await trigger();

      if (valid) {
        const payload = {
          token,
          new_password: getValues("password"),
        };
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await apiETK.post(
          "/auth/reset-password/",
          payload,
          config
        );

        console.log("aaa", response);

        // setIsPasswordUpdate(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <BaseCard>
      <Grid item>{t("pages.UsersSetPassword.description")}</Grid>
      <Grid item>
        <TextField
          inputRef={register}
          name="password"
          id="password"
          type="password"
          variant="outlined"
          required
          fullWidth
          placeholder={t("pages.UsersSetPassword.password")}
          error={Boolean(errors?.password?.message)}
          helperText={errors?.email?.message && t("common.errors.password")}
        />
      </Grid>
      <Grid item>
        <TextField
          inputRef={register}
          name="passwordConfirmation"
          id="passwordConfirmation"
          type="password"
          variant="outlined"
          required
          fullWidth
          placeholder={t("pages.UsersSetPassword.passwordConfirmation")}
          error={Boolean(errors?.passwordConfirmation?.message)}
          helperText={
            errors?.passwordConfirmation?.message && t("common.errors.password")
          }
        />
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

export default function UsersSetPasswordPage() {
  const { t } = useTranslation(["pages", "common"]);
  const schema = yup.object().shape({
    password: yup.string().required(),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });
  const { register, getValues, trigger, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);

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
        {!isPasswordUpdate ? (
          <ChangePasswordForm
            register={register}
            getValues={getValues}
            trigger={trigger}
            errors={errors}
            setIsPasswordUpdate={setIsPasswordUpdate}
            token={router.query.c}
          />
        ) : (
          <Updated />
        )}
      </Grid>
    </AppLayoutGeneral>
  );
}
