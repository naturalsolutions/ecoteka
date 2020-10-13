import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { apiRest } from "../../lib/api";

export interface ETKRegistrationLinkConfirmationProps {
  value: string | string[];
  content: string;
  errorContent?: string[];
  onSuccess?(data?: object): void;
  onError?(data?: object): void;
}

const defaultProps: ETKRegistrationLinkConfirmationProps = {
  value: "",
  content: "",
  errorContent: [
    "We can't validate your account",
    "You gonna be redirected to the homepage",
  ],
};

const useStyles = makeStyles(() =>
  createStyles({
    error: {
      color: "red",
    },
    circularProgress: {
      marginBottom: "2rem",
    },
  })
);

const ETKRegistrationLinkConfirmation: React.FC<ETKRegistrationLinkConfirmationProps> = (
  props
) => {
  const classes = useStyles();

  const makeRequest = async () => {
    try {
      const response = await apiRest.registrationLink.verification(props.value);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      return props.onSuccess(data);
    } catch (e) {
      props.onError(e);
    }
  };

  useEffect(() => {
    makeRequest();
  }, []);

  return (
    <React.Fragment>
      <Grid container direction="column" justify="center" alignItems="center">
        <CircularProgress className={classes.circularProgress} />
        {!props.errorContent ? (
          <Typography component="h5">{props.content}</Typography>
        ) : (
          props.errorContent.map((error, index) => (
            <Typography key={index} component="h5" className={classes.error}>
              {error}
            </Typography>
          ))
        )}
      </Grid>
    </React.Fragment>
  );
};

ETKRegistrationLinkConfirmation.defaultProps = defaultProps;

export default ETKRegistrationLinkConfirmation;
