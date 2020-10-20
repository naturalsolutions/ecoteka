import React, { forwardRef, useImperativeHandle } from "react";
import useForgotPasswordLinkSchema from "./Schema";
import useETKForm from "../Form/useForm";
import { useRouter } from "next/router";
import { Button, Grid, isWidthDown,  Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { apiRest } from "../../lib/api";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

export type ETKFormForgotPasswordLinkActions = {
  submit: () => Promise<boolean>;
};

export interface ETKForgotPasswordLinkProps {
}

const defaultProps: ETKForgotPasswordLinkProps = {
};

const useStyles = makeStyles((theme) =>
  createStyles({
    viewport: {
      height: "100%",
      width: "100%",
      '& .MuiGrid-item': {
        width: "25rem",
        '& .MuiGrid-item': {
          width: "unset"
        }
      }
    }
  })
);

const ETKForgotPasswordLinkForm = forwardRef<ETKFormForgotPasswordLinkActions, ETKForgotPasswordLinkProps>(
  (props, ref) => {
    const classes = useStyles();
    const router = useRouter();
    const uuid = router.query.value
    const { t } = useTranslation(["components", "common"]);
    const schema = useForgotPasswordLinkSchema();
    const { fields, handleSubmit, setError, errors } = useETKForm({
      schema: schema,
    });
    let isOk = false;

    const onCancel = () => {
      router.push("/");
    }

    const onSubmit = async (data) => {
      const { response, json } = await apiRest.forgotPasswordLink.changeForgotPassword(uuid, data);

      if (!response.ok) {
        setError("general", {
          type: "manual",
          message: json.detail,
        });
      }

      isOk = response.ok;
    };

    const submit = handleSubmit(onSubmit);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        await submit();
        return isOk;
      },
    }));

    return (
      <Paper square className={classes.viewport}>
        <Grid container direction="column" justify="center" alignItems="center" className={classes.viewport} >
          <Grid item>Titre grid </Grid>
          {errors.general && (
            <Grid item>
              <Alert color="error">{errors.general?.message}</Alert>
            </Grid>
          )}
          <Grid item>{fields.new_password}</Grid>
          <Grid item>{fields.confirm_new_password}</Grid>
          <Grid item>
            <Grid container direction="row" justify="flex-end" alignItems="center">
              <Grid item>
                <Button onClick={onCancel} >
                  {t("components:ForgotPasswordLink.cancel")}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={onSubmit} >
                  {t("components:ForgotPasswordLink.submit")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
);

ETKForgotPasswordLinkForm.defaultProps = defaultProps;

export default ETKForgotPasswordLinkForm;
