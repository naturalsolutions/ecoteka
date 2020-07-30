import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles, createStyles } from '@material-ui/core/styles';

export interface ETKContactProps {
  isOpen: boolean;
  onClose: Function;
}

const useStyles = makeStyles((theme) => createStyles({
  backdrop: {
    zIndex: 1400,
    color: '#fff',
  },
}));

const ETKContact: React.FC<ETKContactProps> = (props) => {
  const classes = useStyles();

  // TODO: some interface ?
  const getFormDefault = () => {
    return {
      email: {} as any,
      subject: {} as any,
      body: {} as any
    };
  };

  const [form, setForm] = useState(getFormDefault());
  const [isSending, setIsSending] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);

  const handleClose = () => {
    if (isSending) {
      return;
    }
    props.onClose && props.onClose();
  };

  const handleOnEnter = () => {
    console.log('handleonEnter');
    setHasSuccess(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form[e.target.name].value = e.target.value;
    setForm({ ...form });
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const submit = () => {
    // TODO: use AJV ?
    for (const key in form) {
      form[key].errorMessage = "";
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
    setTimeout(() => {
      onResponse();
    }, 1500);
  }

  const onResponse = () => {
    setIsSending(false);
    let error = false;
    if (!error) {
      setHasSuccess(true);
      setForm({ ...getFormDefault() });
    } else {
      //TODO
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        onEnter={() => { handleOnEnter() }}
        onClose={() => { handleClose() }}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Nous contacter</DialogTitle>
        {hasSuccess ?
          <React.Fragment>
            <DialogContent>
              <Typography component="div" align="center" color="textSecondary">
                <CheckCircleIcon style={{ fontSize: 40 }} />
              </Typography>
              <Typography align="center">
                Votre message a bien été envoyé, nous vous répondrons dans les plus brefs délais !
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { handleClose() }} color="primary">Retour à l'accueil</Button>
            </DialogActions>
          </React.Fragment>
          :
          <React.Fragment>
            <DialogContent>
              <Typography component="p" variant="h5">Notre équipe sera heureuse de vous répondre</Typography>
              <Typography>Merci de remplir ce formulaire. Nous vous répondrons dans les plus brefs délais.</Typography>
              <form noValidate autoComplete="off">
                <div>
                  <TextField
                    name="email"
                    required
                    variant="filled"
                    autoFocus
                    margin="dense"
                    label="Votre email"
                    type="email"
                    fullWidth
                    onChange={onInputChange}
                    error={Boolean(form.email.errorMessage)}
                    helperText={form.email.errorMessage}
                  />
                </div>
                <div>
                  <TextField
                    name="subject"
                    required
                    variant="filled"
                    margin="dense"
                    label="Objet du message"
                    fullWidth
                    onChange={onInputChange}
                    error={Boolean(form.subject.errorMessage)}
                    helperText={form.subject.errorMessage}
                  />
                </div>
                <div>
                  <TextField
                    name="body"
                    required
                    variant="filled"
                    margin="dense"
                    label="Quelle est votre question ?"
                    fullWidth
                    multiline
                    rows={3}
                    rowsMax={6}
                    onChange={onInputChange}
                    error={Boolean(form.body.errorMessage)}
                    helperText={form.body.errorMessage}
                  />
                </div>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { handleClose() }} color="primary">
                Cancel
          </Button>
              <Button onClick={() => { submit() }} color="primary">
                Subscribe
          </Button>
            </DialogActions>
          </React.Fragment>
        }
        <Backdrop className={classes.backdrop} open={isSending}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </React.Fragment>
  );
};

export default ETKContact;
