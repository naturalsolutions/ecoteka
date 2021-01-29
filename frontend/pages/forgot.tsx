import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
  Button,
  TextField,
} from "@material-ui/core";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "@/lib/useApi";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const classes = useStyles();
  const { t } = useTranslation(["pages", "common"]);
  const [sent, setSent] = useState<boolean>(false);
  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });
  const { register, getValues, trigger, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { apiETK } = useApi().api;

  const handleOnLogin = () => {
    router.push("/signin");
  };

  const handleSendEmail = async () => {
    const email = getValues("email");
    const valid = await trigger("email");

    if (valid && email) {
      try {
        await apiETK.post(`/auth/password-recovery/${email}`);
      } catch (e) {
      } finally {
        setSent(true);
      }
    }
  };

  const BaseCard = ({ children }) => (
    <Card className={classes.baseCard}>
      <CardHeader title={t("pages:Forgot.EmailCard.title")} />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  const SentCard = (
    <BaseCard>
      <Grid item>
        {t("pages:Forgot.SentCard.description")} {getValues("email")}.
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleOnLogin}
        >
          {t("pages:Forgot.SentCard.buttonOnLogin")}
        </Button>
      </Grid>
    </BaseCard>
  );

  const EmailCard = (
    <BaseCard>
      <Grid item>{t("pages:Forgot.EmailCard.description")}</Grid>
      <Grid item>
        <TextField
          error={Boolean(errors?.email?.message)}
          id="email"
          name="email"
          inputRef={register}
          autoFocus
          required
          fullWidth
          placeholder={t("pages:Forgot.EmailCard.emailPlaceholder")}
          helperText={errors?.email?.message && t("common:errors.email")}
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSendEmail}
        >
          {t("pages:Forgot.EmailCard.sendButton")}
        </Button>
      </Grid>
    </BaseCard>
  );

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("pages:Forgot.EmailCard.title")}</title>
      </Head>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        {sent ? SentCard : EmailCard}
      </Grid>
    </AppLayoutGeneral>
  );
}
