import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface ETKContactProps {
  isOpen: boolean;
  onClose: Function;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: 1400,
      color: "#fff",
    },
  })
);

const ETKContact: React.FC<ETKContactProps> = (props) => {
  const classes = useStyles();

  // TODO: some interface, a schema ?
  const getFormDefault = () => {
    return {
      email: {} as any,
      first_name: {} as any,
      last_name: {} as any,
      phone_number: {} as any,
      township: {} as any,
      position: {} as any,
      contact_request: {} as any,
    };
  };

  const [form, setForm] = useState(getFormDefault());
  const [isSending, setIsSending] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [postErrorMessage, setPostErrorMessage] = useState("");

  const handleClose = () => {
    if (isSending) {
      return;
    }
    props.onClose && props.onClose();
  };

  const handleOnEnter = () => {
    console.log("handleonEnter");
    setHasSuccess(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form[e.target.name].value = e.target.value;
    setForm({ ...form });
  };

  const onCityChange = (item) => {
    form.township.value = item.code;
    setForm({ ...form });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const submit = async () => {
    // TODO: use AJV ?
    const optionalFields = ["phone_number", "position"];
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

    setForm({ ...form });

    for (const key in form) {
      if (form[key].errorMessage) {
        return;
      }
    }

    setIsSending(true);

    const payload: any = {};
    for (const key in form) {
      payload[key] = form[key].value;
    }

    const url = `${publicRuntimeConfig.apiUrl}/contacts`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setIsSending(false);
    const json = await response.json();
    if (response.status == 422) {
      handleError(json);
    } else if (response.status == 200) {
      setHasSuccess(true);
      setForm({ ...getFormDefault() });
    } else {
      setPostErrorMessage("Erreur interne, veuillez recommencer plus tard.");
    }
  };

  const handleError = (data) => {
    data.detail.forEach((error) => {
      const fieldName = error.loc[1];
      form[fieldName].errorMessage = error.msg;
    });

    setForm({ ...form });
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        onEnter={() => {
          handleOnEnter();
        }}
        onClose={() => {
          handleClose();
        }}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Nous contacter</DialogTitle>
        {hasSuccess ? (
          <React.Fragment>
            <DialogContent>
              <Typography component="div" align="center" color="textSecondary">
                <CheckCircleIcon style={{ fontSize: 40 }} />
              </Typography>
              <Typography align="center">
                Votre message a bien été envoyé, nous vous répondrons dans les
                plus brefs délais !
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                }}
                color="primary"
              >
                Retour à l'accueil
              </Button>
            </DialogActions>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogContent>
              <Typography component="p" variant="h5">
                Notre équipe sera heureuse de vous répondre
              </Typography>
              <Typography>
                Merci de remplir ce formulaire. Nous vous répondrons dans les
                plus brefs délais.
              </Typography>
              <form noValidate autoComplete="off">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      name="last_name"
                      required
                      autoFocus
                      fullWidth
                      variant="filled"
                      margin="dense"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Nom"
                      onChange={onInputChange}
                      error={Boolean(form.last_name.errorMessage)}
                      helperText={form.last_name.errorMessage}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="first_name"
                      required
                      fullWidth
                      variant="filled"
                      margin="dense"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Prénom"
                      onChange={onInputChange}
                      error={Boolean(form.first_name.errorMessage)}
                      helperText={form.first_name.errorMessage}
                    />
                  </Grid>
                </Grid>
                <div>
                  <TextField
                    name="email"
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
                    error={Boolean(form.email.errorMessage)}
                    helperText={form.email.errorMessage}
                  />
                </div>
                <div>
                  <TextField
                    name="phone_number"
                    variant="filled"
                    margin="dense"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    label="Téléphone"
                    fullWidth
                    onChange={onInputChange}
                    error={Boolean(form.phone_number.errorMessage)}
                    helperText={form.phone_number.errorMessage}
                  />
                </div>
                <div>
                  <FormControl fullWidth variant="filled" margin="dense">
                    <InputLabel htmlFor="select-position">Position</InputLabel>
                    <Select
                      native
                      disableUnderline
                      inputProps={{
                        name: "position",
                        id: "select-position",
                      }}
                      onChange={onInputChange}
                    >
                      <option aria-label="None" value="" />
                      <option value="Responsable espaces verts">
                        Responsable espaces verts
                      </option>
                      <option value="Directeurs de services technique">
                        Directeurs de services technique
                      </option>
                      <option value="Autres">Autres</option>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    name="township"
                    variant="filled"
                    margin="dense"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    label="Commune dans laquelle vous exercez"
                    fullWidth
                    onChange={onInputChange}
                    error={Boolean(form.township.errorMessage)}
                    helperText={form.township.errorMessage}
                  />
                </div>
                <div>
                  <TextField
                    name="contact_request"
                    required
                    variant="filled"
                    margin="dense"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    label="Quelle est votre question ?"
                    fullWidth
                    multiline
                    rows={3}
                    rowsMax={6}
                    onChange={onInputChange}
                    error={Boolean(form.contact_request.errorMessage)}
                    helperText={form.contact_request.errorMessage}
                  />
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  submit();
                }}
                color="primary"
                variant="contained"
              >
                Envoyer la demande de contact
              </Button>
            </DialogActions>
          </React.Fragment>
        )}
        <Backdrop className={classes.backdrop} open={isSending}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={Boolean(postErrorMessage)}
          onClose={() => {
            setPostErrorMessage("");
          }}
        >
          <Alert
            severity="error"
            variant="filled"
            closeText="OK"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => {
                    setPostErrorMessage("");
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            <div dangerouslySetInnerHTML={{ __html: postErrorMessage }}></div>
          </Alert>
        </Snackbar>
      </Dialog>
    </React.Fragment>
  );
};

export default ETKContact;
