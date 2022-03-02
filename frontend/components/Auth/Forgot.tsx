import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "@/lib/useApi";

const useStyles = makeStyles((theme) => ({
  formWidth: {
    width: 568,
    flex: 1,
    margin: "auto",
    padding: 20,
    minHeight: "calc(100vh - 96px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [theme.breakpoints.only("xs")]: {
    formWidth: {
      width: "100%",
    },
  },
  image: {
    height: "250px",
    backgroundSize: "contain",
  },
}));

const FormForgot = () => {
  const router = useRouter();
  const { t } = useTranslation(["pages", "common"]);
  const { apiETK } = useApi().api;
  const [email, setEmail] = useState<string>("");
  const [passwordRecovery, setPasswordRecovery] = useState<boolean>(false);
  const [emailIsSent, setEmailIsSent] = useState<boolean>(false);
  const classes = useStyles();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("components.SignIn.errorMessageEmail"))
      .required(t("components.SignIn.errorMessageRequiredField")),
  });

  const { register, getValues, handleSubmit, trigger, errors, setError } =
    useForm({
      resolver: yupResolver(schema),
    });

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      handleSubmit(handleSendEmail)();
    }
  };

  const handleSendEmail = async () => {
    const email = getValues("email");
    const valid = await trigger("email");

    if (valid && email) {
      try {
        setPasswordRecovery(true);
        const response = await apiETK.post(`/auth/password-recovery/${email}`);

        const { data, status } = response;
        if (status === 200) {
          setPasswordRecovery(false);
          setEmail(email);
          setEmailIsSent(true);
        }
        return data;
      } catch (error) {
        console.log(error);

        setError("email", {
          type: "manual",
          message: t("common.errors.emailUnmatch"),
        });
        setPasswordRecovery(false);
      }
    }
  };

  return (
    <div className={classes.formWidth}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item>
          <img
            title="Password"
            className={classes.image}
            src="/assets/password.svg"
          />
        </Grid>
        {!emailIsSent ? (
          <>
            <Grid item>
              <Typography variant="h5" color="textPrimary">
                {t("pages.Forgot.EmailCard.title")}
              </Typography>
            </Grid>

            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <Typography>
                  {t("pages.Forgot.EmailCard.description")}
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  error={Boolean(errors?.email?.message)}
                  inputProps={{
                    "data-test": "forgot-form-username",
                  }}
                  id="email"
                  name="email"
                  inputRef={register}
                  required
                  fullWidth
                  placeholder={t("pages.Forgot.EmailCard.emailPlaceholder")}
                  helperText={errors?.email?.message ?? ""}
                  variant="outlined"
                  onKeyDown={() => handleKeyDown}
                />
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(handleSendEmail)}
                  data-test="forgot-form-submit"
                >
                  {!passwordRecovery ? (
                    t("pages.Forgot.EmailCard.sendButton")
                  ) : (
                    <CircularProgress color="primary" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography align="center" data-test="forgot-form-success">
            {t("pages.Forgot.SentCard.description")} <strong>{email}</strong>.
          </Typography>
        )}
        <Grid item>
          <Button fullWidth onClick={() => router.push("/signin")}>
            {t("pages.Forgot.EmailCard.signin")}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default FormForgot;
