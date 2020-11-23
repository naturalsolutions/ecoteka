import { useRef, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import ETKFormSignIn, { ETKFormSignInActions } from "../components/SignIn/Form";
import Template from "../components/Template";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignInPage() {
  const formRef = useRef<ETKFormSignInActions>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);
    if (isOk) {
      router.back();
    }
  };

  return (
    <Template>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          height: "100%",
        }}
      >
        <Container maxWidth="sm">
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
              <Button color="primary" disabled href="/signup">
                Créer un compte
              </Button>
              <Box flexGrow={1} />
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  onSubmit();
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={30} /> : "Connexion"}
              </Button>
            </CardActions>
          </Card>
        </Container>
      </Grid>
    </Template>
  );
}
