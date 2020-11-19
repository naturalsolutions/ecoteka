import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useEtkTeamAreaSchema from "./Schema";
import getConfig from "next/config";
import { apiRest } from "@/lib/api"
import { TOrganization } from "@/pages/organization/[id]";

const { publicRuntimeConfig } = getConfig();

export type ETKFormTeamAreaActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormTeamAreaProps {
  organization: TOrganization
}

const ETKFormTeamArea = forwardRef<ETKFormTeamAreaActions, ETKFormTeamAreaProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useEtkTeamAreaSchema();
    const form = useETKForm({ schema: schema });
    let isOk = false;

    const onSubmit = async (data) => {
      console.log(data)
      /* data = {
        ...data,
        parent_id: props.organization.parent_id
      };
      const response = await apiRest.organization.workingArea(data);
      if (response.ok) {
        isOk = true;
      } */
    };

    const submit = form.handleSubmit(onSubmit);

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
            <Trans>{t('TeamArea.dialogContentText')}</Trans>
          </Typography>
        </Grid>
        <Grid item>{form.fields.file}</Grid>
      </Grid>
    );
  }
);

export default ETKFormTeamArea;
