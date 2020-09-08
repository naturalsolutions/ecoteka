import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import getConfig from "next/config";
import { useRouter } from "next/router";
import api from "../../lib/api";
import { useAppContext } from "../../providers/AppContext";

const { publicRuntimeConfig } = getConfig();

export interface ETKRegistrationLinkConfirmationProps {
  value: string;
  content: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      marginRight: "1rem",
    },
    error: {
      marginRight: "1rem",
      color: "red",
    },
  })
);

const ETKRegistrationLinkConfirmation: React.FC<ETKRegistrationLinkConfirmationProps> = (
  props
) => {
  const classes = useStyles();
  const router = useRouter();
  const { appContext } = useAppContext();
  const [isInError, setIsInError] = useState(false);

  useEffect(() => {
    if (appContext.user) {
      setTimeout(() => {
        makeRequest();
      }, 4000);
    }
  }, [appContext.user]);

  const makeRequest = async () => {
    const url = `${publicRuntimeConfig.apiUrl}/registration_link/verification/${props.value}`;
    const headers = { "Content-Type": "application/json" };

    try {
      const response = await api.get(url, headers);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      if (200 <= response.status && response.status < 400) {
        const data = response.json();
      }

      throw Error(response.statusText);
    } catch (error) {
      setIsInError(error);
      setTimeout(() => {
        router.push("/");
      }, 4000);
    }
  };

  return (
    <React.Fragment>
      <Grid container justify="center" alignItems="center">
        {isInError ? (
          <React.Fragment>
            <Typography component="h5" className={classes.error}>
              We can't validate your account You gonna be redirected to the
              homepage
            </Typography>
            <CircularProgress />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography component="h5" className={classes.content}>
              {props.content}
            </Typography>
            <CircularProgress />
          </React.Fragment>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default ETKRegistrationLinkConfirmation;
