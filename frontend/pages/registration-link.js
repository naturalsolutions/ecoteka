import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";

import { useAppContext } from "../providers/AppContext.js";
import ETKSignin from "../components/SignIn";
import ETKRegistrationLinkConfirmation from "../components/RegistrationLink/Confirmation";

export default function RegistrationLinkPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const { setUser } = useAppContext();
  const [errorContent, setErrorContent] = useState([]);

  const onError = (error) => {
    setErrorContent([error.message]);
    apiRest.auth.logout();
    setUser(null);
    redirect("/");
  };

  const onSuccess = () => {
    redirect("/");
  };

  const redirect = (path) => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  };

  const signIn = (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <React.Fragment>
        <ETKSignin
          isOpen
          onClose={(event, value, newUser) => {
            if (value && value == "cancelByClick") {
              router.push("/");
            }

            if (newUser) {
              setCurrentUser(newUser);
            }
          }}
          titleText="Vous devez vous authentifier avant que l'on puisse verifier votre lien"
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        />
      </React.Fragment>
    </Grid>
  );

  const confirmation = (
    <Grid container style={{ height: "100vh" }}>
      <ETKRegistrationLinkConfirmation
        value={router.query.value}
        content="Merci de patienter pendant que nous verifions votre lien"
        errorContent={errorContent}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Grid>
  );

  return !currentUser ? signIn : confirmation;
}
