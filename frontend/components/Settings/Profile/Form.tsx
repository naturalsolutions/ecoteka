import React, { forwardRef, useImperativeHandle } from "react";
import useProfileSchema from "./Schema";
import useETKForm from "../../Form/useForm";
import { Grid } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import { Alert } from "@material-ui/lab";
import { apiRest } from "../../../lib/api";
import { useAppContext } from "../../../providers/AppContext.js";

export type ETKFormProfileActions = {
  submit: () => Promise<boolean>;
};

export interface ETKProfileProps {}

const defaultProps: ETKProfileProps = {};

const ETKProfileForm = forwardRef<ETKFormProfileActions, ETKProfileProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useProfileSchema();
    const { fields, handleSubmit, setError, errors } = useETKForm({
      schema: schema,
    });
    const { setUser } = useAppContext();

    let isOk = false;

    const onSubmit = async (data) => {
      const { response, json } = await apiRest.users.updateMe(data);

      if (!response.ok) {
        setError("general", {
          type: "manual",
          message: t("components:Profile.formFailed"),
        });
      }

      isOk = response.ok;

      const newUser = await apiRest.users.me();

      if (newUser) {
        setUser(newUser);
      }
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
        <Grid item>{fields.organization_id}</Grid>
      </Grid>
    );
  }
);

ETKProfileForm.defaultProps = defaultProps;

export default ETKProfileForm;
