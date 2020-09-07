import React, { Fragment, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export interface ETKRegisterProps {
  isOpen: boolean;
  onClose: Function;
  submitButtonText: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: 1400,
      color: "#fff",
    },
  })
);

const ETKRegister: React.FC<ETKRegisterProps> = (props) => {
  const classes = useStyles(props);
  const [ isSending, setIsSending ] = useState(false);

  const minLengthPassord = 6
  const getFormDefault = () => {
    return {
      full_name: {} as any,
      email: {} as any,
      password: {} as any,
      password_confirm: {} as any
    };
  };

  const [form, setForm] = useState(getFormDefault())


  const handleClose = () => {
    console.log("onclose register")
    if (isSending) {
      return;
    }
    props.onClose && props.onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form[e.target.name].value = e.target.value;
    setForm({ ...form });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    if(password.length >= minLengthPassord) {
      return true
    }
    return false
  }

  const validatePasswordWithPasswordConfirm = (password, passwordConfirm) => {
    if (validatePassword(password)) {
      return password === passwordConfirm;
    }
    return false
  }


  const submit = async () => {
    const optionalFields = [];
    const fieldsForFrontValidation = ["password_confirm"]
    for (const key in form) {
      form[key].errorMessage = "";
      if (optionalFields.indexOf(key) > -1) {
        continue;
      }
      if (!form[key].value) {
        form[key].errorMessage = "Veuillez renseigner ce champs.";
      }
    }

    if (!validateEmail(form.email.value)) {
      form.email.errorMessage = "Veuillez saisir un email valide.";
    }

    if (!validatePassword(form.password.value)) {
      form.password.errorMessage = `Password should have more than ${minLengthPassord} characters`
    }
    else if (!validatePasswordWithPasswordConfirm(form.password.value, form.password_confirm.value)) {
      form.password.errorMessage = "Password and Password confirm are not the same"
      form.password_confirm.errorMessage = "Password and Password confirm are not the same"
    }

    setForm({ ...form });

    for (const key in form) {
      if (form[key].errorMessage) {
        return;
      }
    }
    const payload: any = {};
    for (const key in form) {
      if (key in fieldsForFrontValidation) {
        continue;
      }
      payload[key] = form[key].value;
    }

    const url = `${publicRuntimeConfig.apiUrl}/auth/register/`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setIsSending(false);
    const json = await response.json();
    if (response.status == 422) {
      // handleError(json);
      console.log("error" , json)
    } else if (response.status == 200) {
      console.log("ok", json)
      // setHasSuccess(true);
      // setForm({ ...getFormDefault() });
    } else {
      console.log("all others errors", json)
      // setPostErrorMessage("Erreur interne, veuillez recommencer plus tard.");
    }
    props.onClose();
  }

  const registerDialog = (
    <Dialog
    open={props.isOpen}
    onClose={() => {
      handleClose();
    }}
    scroll="paper"
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Register</DialogTitle>
        <React.Fragment>
          <DialogContent>
            <form noValidate autoComplete="off">
              <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      name="full_name"
                      required
                      variant="filled"
                      margin="dense"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Full name"
                      fullWidth
                      onChange={onInputChange}
                      error={Boolean(form.full_name.errorMessage)}
                      helperText={form.full_name.errorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      required
                      variant="filled"
                      margin="dense"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Email"
                      fullWidth
                      onChange={onInputChange}
                      error={Boolean(form.email.errorMessage)}
                      helperText={form.email.errorMessage}
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
                      label="Password"
                      type="password"
                      fullWidth
                      onChange={onInputChange}
                      error={Boolean(form.password.errorMessage)}
                      helperText={form.password.errorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="password_confirm"
                      required
                      variant="filled"
                      margin="dense"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Password confirm"
                      type="password"
                      fullWidth
                      onChange={onInputChange}
                      error={Boolean(form.password_confirm.errorMessage)}
                      helperText={form.password_confirm.errorMessage}
                    />
                  </Grid>
              </Grid>
            </form>
          </DialogContent>
        </React.Fragment>
        <DialogActions>
          <Button
            onClick={() => {
              submit();
            }}
            color="primary"
            variant="contained"
          >
            {props.submitButtonText}
          </Button>
      </DialogActions>
  </Dialog>
  )
  return (
    <Fragment>
      {props.isOpen
      ? registerDialog
      : null
      }
    </Fragment>

  )
}


ETKRegister.defaultProps= {
  isOpen: false,
  onClose(){},
  submitButtonText: 'Submit'
}

export default ETKRegister;