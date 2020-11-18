import React, { forwardRef, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useEtkTeamSchema from "./Schema";
import getConfig from "next/config";
import { apiRest } from "@/lib/api"

const { publicRuntimeConfig } = getConfig();

export type ETKFormTeamActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormTeamProps {
  parent_id?: number;
}

const defaultProps: ETKFormTeamProps = {};

const ETKFormTeam = forwardRef<ETKFormTeamActions, ETKFormTeamProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useEtkTeamSchema();
    const { fields, handleSubmit } = useETKForm({ schema: schema });
    let isOk = false;

    const onSubmit = async (data) => {
      console.log(props)
      data = {
        ...data,
        parent_id: props.parent_id
      };
      const response = await apiRest.organization.post(data);
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
            <Trans>{t("Team.dialogContentText")}</Trans>
          </Typography>
        </Grid>
        <Grid item>{fields.name}</Grid>
        <Grid item>{fields.slug}</Grid>
      </Grid>
    );
  }
);

ETKFormTeam.defaultProps = defaultProps;

export default ETKFormTeam;
