import React, { forwardRef, useImperativeHandle } from "react";
import useForgotPasswordSchema from "./Schema";
import useETKForm from "../Form/useForm";
import { Grid } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import { Alert } from "@material-ui/lab";
import { apiRest } from "../../lib/api";

export type ETKFormForgotPasswordActions = {
  submit: () => Promise<boolean>;
};

export interface ETKForgotPasswordProps {}

const defaultProps: ETKForgotPasswordProps = {};

const ETKForgotPasswordForm = forwardRef<ETKFormForgotPasswordActions, ETKForgotPasswordProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useForgotPasswordSchema();
    const { fields, handleSubmit, setError, errors } = useETKForm({
      schema: schema,
    });
    let isOk = false;

    const onSubmit = async (data) => {
      const { response, json } = await apiRest.forgotPassword.generate(data);

      if (!response.ok) {
        setError("general", {
          type: "manual",
          message: t("components:ForgotPassword.formFailed"),
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
      <Grid container direction="column">
        {errors.general && (
          <Grid item>
            <Alert color="error">{errors.general?.message}</Alert>
          </Grid>
        )}
        <Grid item>{fields.email}</Grid>
      </Grid>
    );
  }
);

ETKForgotPasswordForm.defaultProps = defaultProps;

export default ETKForgotPasswordForm;
