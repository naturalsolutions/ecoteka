import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import ETKFormSignIn, { ETKFormSignInActions } from "@/components/SignIn/Form";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayoutGeneral from "@/components/AppLayout/General";

export default function SignInPage() {
  const formRef = useRef<ETKFormSignInActions>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);

    if (isOk) {
      router.push("/edition/");
    }
  };

  return (
    <AppLayoutGeneral>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "calc(100vh - 48px)" }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" align="center">
              Connectez-vous à votre compte
            </Typography>
            <ETKFormSignIn ref={formRef}></ETKFormSignIn>
            <Link href="/reset-password">
              <a style={{ color: "white" }}>Mot de passe oublié?</a>
            </Link>
          </CardContent>
          <CardActions disableSpacing>
            <Box flexGrow={1} />
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={30} /> : "Connexion"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </AppLayoutGeneral>
  );
}
