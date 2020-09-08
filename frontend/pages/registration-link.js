import React, { useState } from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import { useAppContext } from "../providers/AppContext";
import ETKSignin from "../components/SignIn";
import ETKRegistrationLinkConfirmation from "../components/RegistrationLink/Confirmation";

export default function RegistrationLinkPage({ value }) {
  const router = useRouter();
  const { appContext } = useAppContext();
  const [isSigninOpen] = useState(!appContext.user);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {!appContext.user ? (
        <React.Fragment>
          <ETKSignin
            isOpen={isSigninOpen}
            onClose={(event, value) => {
              if (value && value == "cancelByClick") {
                //redirect to home page
                router.push("/");
              }
            }}
            titleText="Vous devez vous authentifier avant que l'on puisse verifier votre lien"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ETKRegistrationLinkConfirmation
            value={value}
            content="Merci de patienter pendant que nous verifions votre lien"
          />
        </React.Fragment>
      )}
    </Grid>
  );
}

RegistrationLinkPage.getInitialProps = ({ query: { value } }) => {
  return { value };
};
