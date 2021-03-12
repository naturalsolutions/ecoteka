import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useRootOrganizationSchema from "@/components/Admin/RootOrganization/Form/Schema";
import useAPI from "@/lib/useApi";
import { IOrganization } from "@/index.d";
import { useAppContext } from "@/providers/AppContext";

export type FormOrganizationRootActions = {
  submit: () => Promise<any>;
};

export interface FormOrganizationRootProps {
  organization?: IOrganization;
  translationNode?: string;
}

const defaultProps: FormOrganizationRootProps = {
  translationNode: "Organization",
};

const FormOrganizationRoot = forwardRef<
  FormOrganizationRootActions,
  FormOrganizationRootProps
>(({ organization, translationNode }, ref) => {
  const { t } = useTranslation("components");
  const schema = useRootOrganizationSchema();
  const form = useETKForm({ schema: schema });
  const { api } = useAPI();
  const { apiETK } = api;
  const isNew = !Boolean(organization?.id);
  const { refetchUserData } = useAppContext();

  // Why a useEffect to make setValue works ?
  useEffect(() => {
    console.log(schema);
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
          try {
            const response = isNew
              ? await apiETK.post("/admin/organization/root_nodes", data)
              : await apiETK.patch(`/organization/${organization.id}`, data);
            if (response.status === 200) {
              resolve(response);
              refetchUserData();
            }
          } catch (e) {
            refetchUserData();
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
      <Grid item>{form.fields.owner_email}</Grid>
      <Grid item>{form.fields.mode}</Grid>
    </Grid>
  );
});

FormOrganizationRoot.defaultProps = defaultProps;

export default FormOrganizationRoot;
