import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useEtkOrganizationSchema from "@/components/Organization/Form/Schema";
import { apiRest } from "@/lib/api"
import { TOrganization } from "@/pages/organization/[id]";

export type ETKFormOrganizationActions = {
  submit: () => Promise<boolean>;
};

export interface ETKFormOrganizationProps {
  organization?: TOrganization,
  translationNode?: string,
}

const defaultProps: ETKFormOrganizationProps = {
  translationNode: 'Organization'
};

const ETKFormOrganization = forwardRef<ETKFormOrganizationActions, ETKFormOrganizationProps>(
  (props, ref) => {
    const { t } = useTranslation("components");
    const schema = useEtkOrganizationSchema();
    const form = useETKForm({ schema: schema });
    let isOk = false;
    const isNew = !Boolean(props.organization?.id);

    // Why a useEffect to make setValue works ?
    useEffect(() => {
      if (!isNew) {
        for (let key in props.organization) {
          if (schema.hasOwnProperty(key)) {
            form.setValue(key, props.organization[key]);
          }
        }
      }
    }, []);

    const onSubmit = async (data) => {
      console.log(props)
      data = {
        ...data
      };
      if (isNew) {
        data.parent_id = props.organization.parent_id;
      }
      const response = isNew ?
        await apiRest.organization.post(data) :
        await apiRest.organization.patch(props.organization.id, data);
      //We could do that (and more) inapi
      if (response.ok) {
        isOk = true;
      }
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
            <Trans>{t(`${props.translationNode}.dialogContentText${isNew ? 'Create' : 'Edit'}`)}</Trans>
          </Typography>
        </Grid>
        <Grid item>{form.fields.name}</Grid>
      </Grid>
    );
  }
);

ETKFormOrganization.defaultProps = defaultProps;

export default ETKFormOrganization;
