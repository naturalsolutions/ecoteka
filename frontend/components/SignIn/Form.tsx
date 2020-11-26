import React, { forwardRef, useImperativeHandle } from "react";
import { Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import useETKForm from "../Form/useForm";
import useETKSignInSchema from "./Schema";
import { apiRest } from "../../lib/api";
import { useAppContext } from "../../providers/AppContext";

export type ETKFormSignInActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormSignInProps {}

const defaultProps: ETKFormSignInProps = {};

const ETKFormSignIn = forwardRef<ETKFormSignInActions, ETKFormSignInProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useETKSignInSchema();
    const { fields, handleSubmit, setError } = useETKForm({ schema: schema });
    const { setUser } = useAppContext();
    let logged = false;

    const onSubmit = async (data) => {
      const token = await apiRest.auth.accessToken(data);

      if (!token) {
        setError("username", {
          type: "manual",
          message: t("SignIn.errorMessageServer"),
        });
        setError("password", {
          type: "manual",
          message: t("SignIn.errorMessageServer"),
        });
      }

      const newUser = await apiRest.users.me();

      if (newUser) {
        if (newUser.organizations.length === 1) {
          newUser.currentOrganization = newUser.organizations[0];
        }

        setUser(newUser);
        logged = true;
      }
    };

    const submit = handleSubmit(onSubmit);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        await submit();
        return logged;
      },
    }));

    return (
      <Grid container direction="column">
        <Grid item>{fields.username}</Grid>
        <Grid item>{fields.password}</Grid>
      </Grid>
    );
  }
);

ETKFormSignIn.defaultProps = defaultProps;

export default ETKFormSignIn;
