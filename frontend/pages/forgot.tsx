import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
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
  image: {
    height: "250px",
    backgroundSize: "contain",
  },
}));

const BaseCard = ({ children }) => {
  const classes = useStyles();
  const { t } = useTranslation(["pages", "common"]);

  return (
    <Card elevation={0} className={classes.baseCard}>
      <CardMedia
        image="/assets/password.svg"
        title="Password"
        className={classes.image}
      />
      <CardHeader
        title={t("pages.Forgot.EmailCard.title")}
        className={classes.baseCardTitle}
      />
      <CardContent>
        <Grid container direction="column" spacing={1}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
};

const SentCard = ({ email, onLogin }) => {
  const { t } = useTranslation();

  return (
    <BaseCard>
      <Grid item>
        <Box mt={2} mb={3}>
          <Typography align="center">
            {t("pages.Forgot.SentCard.description")} <strong>{email}</strong>.
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Button fullWidth variant="contained" color="primary" onClick={onLogin}>
          {t("pages.Forgot.SentCard.buttonOnLogin")}
        </Button>
      </Grid>
    </BaseCard>
  );
};

const EmailCard = ({ onSendEmail = (email: string) => {}, onLogin }) => {
  const { t } = useTranslation(["pages", "common"]);
  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });
  const { register, getValues, trigger, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { apiETK } = useApi().api;
  const [passwordRecovery, setPasswordRecovery] = useState<boolean>(false);

  const handleSendEmail = async () => {
    const email = getValues("email");
    const valid = await trigger("email");

    if (valid && email) {
      try {
        setPasswordRecovery(true);
        await apiETK.post(`/auth/password-recovery/${email}`);
      } catch (e) {
      } finally {
        setPasswordRecovery(false);
        onSendEmail(email);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSendEmail();
    }
  };

  return (
    <BaseCard>
      <Grid item>
        <Typography>{t("pages.Forgot.EmailCard.description")}</Typography>
      </Grid>
      <Grid item>
        <Box my={2}>
          <TextField
            error={Boolean(errors?.email?.message)}
            id="email"
            name="email"
            inputRef={register}
            inputProps={{ "data-testid": "forgot-page-email" }}
            required
            fullWidth
            placeholder={t("pages.Forgot.EmailCard.emailPlaceholder")}
            helperText={errors?.email?.message && t("common.errors.email")}
            variant="outlined"
            onKeyDown={handleKeyDown}
          />
        </Box>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          size="large"
          variant="contained"
          color="primary"
          onClick={handleSendEmail}
        >
          {!passwordRecovery ? (
            t("pages.Forgot.EmailCard.sendButton")
          ) : (
            <CircularProgress color="primary" />
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button fullWidth onClick={onLogin}>
          {t("pages.Forgot.EmailCard.signin")}
        </Button>
      </Grid>
    </BaseCard>
  );
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation(["pages", "common"]);
  const [email, setEmail] = useState<string>("");

  const handleOnLogin = () => {
    router.push("/signin");
  };

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("pages.Forgot.EmailCard.title")}</title>
      </Head>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        {!email ? (
          <EmailCard
            onSendEmail={(newEmail) => setEmail(newEmail)}
            onLogin={handleOnLogin}
          />
        ) : (
          <SentCard email={email} onLogin={handleOnLogin} />
        )}
      </Grid>
    </AppLayoutGeneral>
  );
}
