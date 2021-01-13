import { useState } from "react";
import { useRouter } from "next/router";
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
import Head from "next/head";

const useStyles = makeStyles((theme) => ({}));

export default function ResetPasswordPage() {
  const classes = useStyles();
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const router = useRouter();

  const handleOnLogin = () => {
    router.push("/signin");
  };

  const handleSendEmail = () => {
    setSent(true);
  };

  const sentCard = (
    <Card>
      <CardHeader title="Recover Password" />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            If account exists, an email will be sent with further instructions
          </Grid>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleOnLogin}
            >
              Login
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
          <Grid item>Don’t worry, happens to the best of us</Grid>
          <Grid item>Your email</Grid>
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
              Email me a recovery link
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <AppLayoutGeneral>
      <Head>
        <title>ecoTeka - Recover Password</title>
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
