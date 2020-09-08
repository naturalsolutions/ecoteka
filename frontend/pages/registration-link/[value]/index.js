import React, { useState } from "react";
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Auth from '../../../components/Auth.js';
import ETKSignin from '../../../components/SignIn';
import ETKRegistrationLinkConfirmation from '../../../components/RegistrationLink/Confirmation'


export default function index () {
  const router = useRouter()
  const { session, setSession } = Auth.useSession()
  const [ isSigninOpen , setSigninOpen ] = useState(!session)
  const { value } = router.query


  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      {
      !session
      ? (
        <React.Fragment>
          <ETKSignin
            isOpen={isSigninOpen}
            onClose={ (e) => {
              if( !session ) {
                //redirect to home page
                router.push('/')
              }
            }}
            titleText="You need to login before activate your account"
          />
        </React.Fragment>
        )
      : (
        <React.Fragment>
          <ETKRegistrationLinkConfirmation
            value={value}
            content="Please wait while we activate your account"
          />
        </React.Fragment>
        )
      }
    </Grid>
  )
}
