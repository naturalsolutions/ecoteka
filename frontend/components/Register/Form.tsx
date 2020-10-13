import React, { forwardRef, useImperativeHandle } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import useEtkRegisterSchema from './Schema';
import useETKForm from "../Form/useForm";
import Grid from '@material-ui/core/Grid';
import { apiRest } from "../../lib/api";

export type ETKFormRegisterActions = {
  submit: () => Promise<boolean>;
};

export interface ETKRegisterProps {
};

const defaultProps: ETKRegisterProps = {
};

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: 1400,
      color: "#fff",
    },
  })
);

const ETKRegisterForm = forwardRef<ETKFormRegisterActions, ETKRegisterProps>(
  (props, ref) => {

    const schema = useEtkRegisterSchema();
    const { fields, handleSubmit } = useETKForm({ schema: schema });

    const onSubmit = async (data) => {
      const { response, json } = await apiRest.auth.register(data);

      if (response.status == 422) {
        // handleError(json);
        console.log("error", json);
        throw (json);
      } else if (response.status == 200) {
        console.log("ok", json);
      } else {
        console.log("all others errors", json);
        throw(json); 
        // setPostErrorMessage("Erreur interne, veuillez recommencer plus tard.");
      }
    };
    const submit = handleSubmit(
      onSubmit,
      (errors, event) => {throw {validationErrors: errors}}
    );

    useImperativeHandle(ref, () => ({
      submit: async () => {
        try {
          await submit();
          console.log('form ok');
          return true;
        } catch (e) {
          if ('validationErrors' in e) {
            console.log('validation errors', e);
            return false;
          } else {
            console.log('submit failed');
            throw (e);
          }
        }
      }
    }));

    return (
      <Grid container direction="column">
        <Grid item>
          { fields.full_name }
        </Grid>
        <Grid item>
          { fields.email }
        </Grid>
        <Grid item>
          { fields.organization }
        </Grid>
        <Grid item>
          { fields.password }
        </Grid>
        < Grid item>
          { fields.password_confirm }
        </Grid>
      </Grid>
    );
});

ETKRegisterForm.defaultProps = defaultProps;

export default ETKRegisterForm;
