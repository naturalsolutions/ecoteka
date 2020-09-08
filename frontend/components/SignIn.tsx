import { Fragment, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import getConfig from "next/config";
import { apiRest } from "../lib/api";
import { useAppContext } from "../providers/AppContext.js";

const { publicRuntimeConfig } = getConfig();

export interface ETKSigninProps {
  isOpen: boolean;
  onClose: Function;
  titleText: string;
  buttonCancelText?: string;
  buttonConnexionText?: string;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
}

const defaultProps: ETKSigninProps = {
  isOpen: false,
  onClose: () => {},
  titleText: "Login",
  buttonCancelText: "Annuler",
  buttonConnexionText: "Connexion",
  disableBackdropClick: false,
  disableEscapeKeyDown: false,
};

const ETKSignin: React.FC<ETKSigninProps> = (props) => {
  const { appContext, setAppContext } = useAppContext();

  const getFormDefault = () => {
    return {
      username: {} as any,
      password: {} as any,
    };
  };

  const [form, setForm] = useState(getFormDefault());
  const [isSending, setIsSending] = useState(false);

  const handleClose = (event: object, reason: string) => {
    if (isSending) {
      return;
    }
    props.onClose && props.onClose(event, reason);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form[e.target.name].value = e.target.value;
    setForm({ ...form });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const submit = async () => {
    const optionalFields = [];

    for (const key in form) {
      form[key].errorMessage = "";
      if (optionalFields.indexOf(key) > -1) {
        continue;
      }
      if (!form[key].value) {
        form[key].errorMessage = "Veuillez renseigner ce champs.";
      }
    }

    if (!validateEmail(form.username.value)) {
      form.username.errorMessage = "Veuillez saisir un email valide.";
    }

    setForm({ ...form });

    for (const key in form) {
      if (form[key].errorMessage) {
        return;
      }
    }

    setIsSending(true);

    const credentials = {
      username: form["username"].value,
      password: form["password"].value,
    };

    const token = await apiRest.auth.accessToken(credentials);

    if (!token) {
      form.username.errorMessage = "Incorrect email or password";
      form.password.errorMessage = "Incorrect email or password";
      setIsSending(false);
      return;
    }

    setIsSending(false);
    const user = await apiRest.users.me();

    if (user) {
      setAppContext({
        ...appContext,
        user,
      });
    }

    props.onClose();
  };

  const signupDialog = (
    <Dialog
      open={props.isOpen}
      onClose={(event: object, reason: string) => {
        handleClose(event, reason);
      }}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      disableBackdropClick={props.disableBackdropClick}
      disableEscapeKeyDown={props.disableEscapeKeyDown}
    >
      <DialogTitle id="scroll-dialog-title">{props.titleText}</DialogTitle>
      <Fragment>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  variant="filled"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  label="Adresse email"
                  type="email"
                  fullWidth
                  onChange={onInputChange}
                  error={Boolean(form.username.errorMessage)}
                  helperText={form.username.errorMessage}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  required
                  variant="filled"
                  margin="dense"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  label="Mot de passe"
                  type="password"
                  fullWidth
                  onChange={onInputChange}
                  error={Boolean(form.password.errorMessage)}
                  helperText={form.password.errorMessage}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Fragment>
      <DialogActions>
        <Button
          onClick={(event: object) => {
            handleClose(event, "cancelByClick");
          }}
        >
          {props.buttonCancelText}
        </Button>
        <Button
          onClick={() => {
            submit();
          }}
          color="primary"
          variant="contained"
        >
          {props.buttonConnexionText}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return <Fragment>{props.isOpen ? signupDialog : null}</Fragment>;
};

ETKSignin.defaultProps = defaultProps;

export default ETKSignin;
