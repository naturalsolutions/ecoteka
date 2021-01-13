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
import MailIcon from "@material-ui/icons/Mail";
import AppLayoutGeneral from "@/components/AppLayout/General";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({}));

export default function ResetPasswordPage() {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation("pages");
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  const handleOnLogin = () => {
    router.push("/signin");
  };

  const handleSendEmail = () => {
    setSent(true);
  };

  const sentCard = (
    <Card>
      <CardHeader title={t("forgot.title")} />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>{t("forgot.sentCard.description")}</Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleOnLogin}
            >
              {t("forgot.sentCard.buttonOnLogin")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const emailCard = (
    <Card>
      <CardHeader title="Recover Password" />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>{t("forgot.emailCard.description")}</Grid>
          <Grid item>{t("forgot.emailCard.emailTitle")}</Grid>
          <Grid item>
            <TextField
              InputProps={{
                startAdornment: <MailIcon />,
              }}
              autoFocus
              size="small"
              fullWidth
              variant="outlined"
              value={email}
            />
          </Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendEmail}
            >
              {t("forgot.emailCard.buttonSendEmail")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka · {t("forgot.title")}</title>
      </Head>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        {sent ? sentCard : emailCard}
      </Grid>
    </AppLayoutGeneral>
  );
}
