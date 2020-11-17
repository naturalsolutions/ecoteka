import { useRef, useState } from "react";
import { Button, Card, CardActions, CardContent, CircularProgress, Grid } from "@material-ui/core";
import ETKFormSignIn, { ETKFormSignInActions } from "../components/SignIn/Form";
import Template from "../components/Template";
import { useRouter } from "next/router";

export default function SignInPage() {

  const formRef = useRef<ETKFormSignInActions>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const isOk = await formRef.current.submit();
    setIsLoading(false);
    if (isOk) {
      router.push('/');
    }
  }

  return (

    <Template>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          height: "100%"
        }}
      >
        <Card>
          <CardContent>
            <ETKFormSignIn ref={formRef}></ETKFormSignIn>
          </CardContent>
          <CardActions className="actions">
            <Button onClick={() => {
              onSubmit();
            }} disabled={isLoading}>OK</Button>
            {isLoading && <CircularProgress></CircularProgress>}
          </CardActions>
        </Card>
      </Grid>
    </Template>
  );
}