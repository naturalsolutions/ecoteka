import React, { useState } from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/AGrid";
import { useAppContext } from "../../../providers/AppContext";
import ETKSignin from "../../../components/SignIn";
import ETKRegistrationLinkConfirmation from "../../../components/RegistrationLink/Confirmation";

export default function index() {
  const router = useRouter();
  const { appContext } = useAppContext();
  const [isSigninOpen] = useState(!appContext.user);
  const { value } = router.query;

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
            onClose={(e) => {
              if (!session) {
                //redirect to home page
                router.push("/");
              }
            }}
            titleText="You need to login before activate your account"
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ETKRegistrationLinkConfirmation
            value={value}
            content="Please wait while we activate your account"
          />
        </React.Fragment>
      )}
    </Grid>
  );
}
