import React, { forwardRef, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "../Form/useForm";
import useEtkContactSchema from "./Schema";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export type ETKFormContactActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormContactProps {}

const defaultProps: ETKFormContactProps = {};

const ETKFormContact = forwardRef<ETKFormContactActions, ETKFormContactProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useEtkContactSchema();
    const { fields, handleSubmit } = useETKForm({ schema: schema });
    let isOk = false;

    const onSubmit = async (data) => {
      const url = `${publicRuntimeConfig.apiUrl}/contacts/`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      await response.json();

      if (response.ok) {
        isOk = true;
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
        <Grid item>
          <Typography variant="h5" paragraph>
            <Trans>{t("Contact.dialogContentText")}</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <Typography paragraph>{t("Contact.dialogContentHint")}</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              {fields.last_name}
            </Grid>
            <Grid item xs={6}>
              {fields.first_name}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>{fields.email}</Grid>
        <Grid item>{fields.phone_number}</Grid>
        <Grid item>{fields.position}</Grid>
        <Grid item>{fields.township}</Grid>
        <Grid item>{fields.contact_request}</Grid>
      </Grid>
    );
  }
);

ETKFormContact.defaultProps = defaultProps;

export default ETKFormContact;
