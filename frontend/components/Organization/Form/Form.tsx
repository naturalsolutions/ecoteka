import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useEtkOrganizationSchema from "@/components/Organization/Form/Schema";
import useAPI from "@/lib/useApi";
import { IOrganization } from "@/index.d";

export type ETKFormOrganizationActions = {
  submit: () => Promise<any>;
};

export interface ETKFormOrganizationProps {
  organization?: IOrganization;
  translationNode?: string;
}

const defaultProps: ETKFormOrganizationProps = {
  translationNode: "Organization",
};

const ETKFormOrganization = forwardRef<
  ETKFormOrganizationActions,
  ETKFormOrganizationProps
>(({ organization, translationNode }, ref) => {
  const { t } = useTranslation("components");
  const schema = useEtkOrganizationSchema();
  const form = useETKForm({ schema: schema });
  const { api } = useAPI();
  const { apiETK } = api;
  const isNew = !Boolean(organization?.id);

  // Why a useEffect to make setValue works ?
  useEffect(() => {
    if (!isNew) {
      for (let key in organization) {
        if (schema.hasOwnProperty(key)) {
          form.setValue(key, organization[key]);
        }
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    submit: () => {
      // TODO : Refact this to be more concise
      return new Promise((resolve, reject) => {
        form.handleSubmit(async (data) => {
          data = {
            ...data,
          };
          if (isNew) {
            data.parent_id = organization.parent_id;
          }
          try {
            const response = isNew
              ? await apiETK.post("/organization", data)
              : await apiETK.patch(`/organization/${organization.id}`, data);
            if (response.status === 200) {
              resolve(response);
            }
          } catch (e) {
            reject(e);
          }
        })();
      });
    },
  }));

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5" paragraph>
          <Trans>
            {t(
              `${translationNode}.dialogContentText${isNew ? "Create" : "Edit"}`
            )}
          </Trans>
        </Typography>
      </Grid>
      <Grid item>{form.fields.name}</Grid>
    </Grid>
  );
});

ETKFormOrganization.defaultProps = defaultProps;

export default ETKFormOrganization;
