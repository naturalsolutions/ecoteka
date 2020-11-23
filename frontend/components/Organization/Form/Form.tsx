import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useEtkOrganizationSchema from "@/components/Organization/Form/Schema";
import { apiRest } from "@/lib/api"
import { IOrganization } from "@/index.d"

export type ETKFormOrganizationActions = {
  submit: () => Promise<IOrganization>;
};

export interface ETKFormOrganizationProps {
  organization?: IOrganization,
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

    useImperativeHandle(ref, () => ({
      submit: () => {
        return new Promise((resolve, reject) => {
          form.handleSubmit(async (data) => {
            data = {
              ...data
            };
            if (isNew) {
              data.parent_id = props.organization.parent_id;
            }
            const response = isNew ?
              await apiRest.organization.post(data) :
              await apiRest.organization.patch(props.organization.id, data);
            
            resolve(response);
          })();
        });
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
