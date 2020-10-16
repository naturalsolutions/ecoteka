import React, { forwardRef, useImperativeHandle } from "react";
import useEtkRegisterSchema from "./Schema";
import useETKForm from "../Form/useForm";
import { Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { apiRest } from "../../lib/api";

export type ETKFormRegisterActions = {
  submit: () => Promise<boolean>;
};

export interface ETKRegisterProps {}

const defaultProps: ETKRegisterProps = {};

const ETKRegisterForm = forwardRef<ETKFormRegisterActions, ETKRegisterProps>(
  (props, ref) => {
    const schema = useEtkRegisterSchema();
    const { fields, handleSubmit, setError, errors } = useETKForm({
      schema: schema,
    });
    let isOk = false;

    const onSubmit = async (data) => {
      const { response, json } = await apiRest.auth.register(data);

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
      <Grid container direction="column">
        {errors.general && (
          <Grid item>
            <Alert color="error">{errors.general?.message}</Alert>
          </Grid>
        )}
        <Grid item>{fields.full_name}</Grid>
        <Grid item>{fields.email}</Grid>
        <Grid item>{fields.organization}</Grid>
        <Grid item>{fields.password}</Grid>
        <Grid item>{fields.password_confirm}</Grid>
      </Grid>
    );
  }
);

ETKRegisterForm.defaultProps = defaultProps;

export default ETKRegisterForm;
