import { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { apiRest } from "../lib/api";
import { useAppContext } from "../providers/AppContext.js";
import { useTranslation } from "react-i18next";

export interface ETKSigninProps {
  titleText?: string;
  isOpen: boolean;
  onClose: Function;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
}

const defaultProps: ETKSigninProps = {
  isOpen: false,
  onClose: () => {},
  disableBackdropClick: false,
  disableEscapeKeyDown: false,
};

const ETKSignin: React.FC<ETKSigninProps> = (props) => {
  const { setUser } = useAppContext();
  const { t } = useTranslation("components");

  const getFormDefault = () => {
    return {
      username: {} as any,
      password: {} as any,
    };
  };

  const [form, setForm] = useState(getFormDefault());
  const [isSending, setIsSending] = useState(false);

  const handleClose = (event: object, reason: string, user?: object) => {
    if (isSending) {
      return;
    }
    props.onClose && props.onClose(event, reason, user);
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
        form[key].errorMessage = t("SignIn.errorMessageRequiredField");
      }
    }

    if (!validateEmail(form.username.value)) {
      form.username.errorMessage = t("SignIn.errorMessageEmail");
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
      form.username.errorMessage = t("SignIn.errorMessageServer");
      form.password.errorMessage = form.username.errorMessage;
      setIsSending(false);
      return;
    }

    setIsSending(false);
    const newUser = await apiRest.users.me();

    if (newUser) {
      setUser(newUser);
    }

    handleClose(null, null, newUser);
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
      <DialogTitle id="scroll-dialog-title">
        {props.titleText ? props.titleText : t("SignIn.title")}
      </DialogTitle>
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
                  label={t("SignIn.labelUsername")}
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
                  label={t("SignIn.labelPassword")}
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
          {t("SignIn.buttonCancel")}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            submit();
          }}
          variant="contained"
        >
          {t("SignIn.buttonConnexion")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return <Fragment>{props.isOpen ? signupDialog : null}</Fragment>;
};

ETKSignin.defaultProps = defaultProps;

export default ETKSignin;
