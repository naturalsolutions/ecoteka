import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Backdrop,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface ETKContactProps {
  isOpen: boolean;
  onClose: Function;
}

const defaultProps: ETKContactProps = {
  isOpen: false,
  onClose: () => {},
};

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
  const { t } = useTranslation("components");

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
  const [postErrorMessage, setPostErrorMessage] = useState("" as any);

  const handleClose = () => {
    if (isSending) {
      return;
    }
    props.onClose && props.onClose();
  };

  const handleOnEnter = () => {
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

    const url = `${publicRuntimeConfig.apiUrl}/contacts/`;
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
      setPostErrorMessage(t("Contact.postErrorMessage"));
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
        <DialogTitle id="scroll-dialog-title">
          {t("Contact.dialogTile")}
        </DialogTitle>
        {hasSuccess ? (
          <React.Fragment>
            <DialogContent>
              <Typography component="div" align="center" color="textSecondary">
                <CheckCircleIcon style={{ fontSize: 40 }} />
              </Typography>
              <Typography align="center">
                {t("Contact.successMessageContent")}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                }}
                color="primary"
              >
                {t("Contact.buttonHomeContent")}
              </Button>
            </DialogActions>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogContent>
              <Typography component="p" variant="h5">
                {t("Contact.dialogContentText")}
              </Typography>
              <Typography>{t("Contact.dialogContentHint")}</Typography>
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
                {t("Contact.buttonCancelContent")}
              </Button>
              <Button
                onClick={() => {
                  submit();
                }}
                color="primary"
                variant="contained"
              >
                {t("Contact.buttonSubmitContent")}
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

ETKContact.defaultProps = defaultProps;

export default ETKContact;
