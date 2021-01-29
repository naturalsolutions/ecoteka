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

export default function UsersSetPasswordPage() {
  const classes = useStyles();
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
  const { apiETK } = useApi().api;
  const router = useRouter();

  const handleChangePassword = async () => {
    const valid = await trigger();

    if (valid) {
      await apiETK.post(
        "/auth/reset-password/",
        {
          token: router.query.c,
          new_password: getValues("password"),
        },
        {
          headers: {
            Authorization: `Bearer ${router.query.c}`,
          },
        }
      );
    }
  };

  const BaseCard = ({ children }) => (
    <Card className={classes.baseCard}>
      <CardHeader title={t("pages:UsersSetPassword.title")} />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  const ChangePasswordForm = () => (
    <BaseCard>
      <Grid item>
        <TextField
          inputRef={register}
          name="password"
          id="password"
          type="password"
          variant="outlined"
          required
          fullWidth
          placeholder={t("pages:UsersSetPassword.password")}
          error={Boolean(errors?.password?.message)}
          helperText={errors?.email?.message && t("common:errors.password")}
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
          placeholder={t("pages:UsersSetPassword.passwordConfirmation")}
          error={Boolean(errors?.passwordConfirmation?.message)}
          helperText={
            errors?.passwordConfirmation?.message && t("common:errors.password")
          }
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleChangePassword}
        >
          {t("pages:UsersSetPassword.button")}
        </Button>
      </Grid>
    </BaseCard>
  );

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("pages:UsersSetPassword.title")}</title>
      </Head>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <ChangePasswordForm />
      </Grid>
    </AppLayoutGeneral>
  );
}
