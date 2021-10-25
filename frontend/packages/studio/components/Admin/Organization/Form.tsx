import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";
import useETKForm from "@/components/Form/useForm";
import useOrganizationSchema from "@/components/Admin/Organization/Schema";
import useAPI from "@/lib/useApi";
import { IOrganization } from "@/index.d";
import { useAppContext } from "@/providers/AppContext";
import SearchPlace from "./SearchPlace";

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
  const schema = useOrganizationSchema();
  const form = useETKForm({ schema: schema });
  const { api } = useAPI();
  const { apiETK } = api;
  const isNew = !Boolean(organization?.id);
  const { refetchUserData } = useAppContext();

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

  const handleOnChangePlace = (value) => {
    // console.log(value);
    if (value) {
      form.setValue("osm_id", value.osm_id);
      form.setValue("osm_type", value.osm_type);
    } else {
      form.setValue("osm_id", undefined);
      form.setValue("osm_id", undefined);
    }
  };

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
      <SearchPlace onChange={handleOnChangePlace} />
      <Grid item>{form.fields.osm_id}</Grid>
      <Grid item>{form.fields.osm_type}</Grid>
      <Grid item>{form.fields.population_size}</Grid>
      <Grid item>{form.fields.area_sq_km}</Grid>
      <Grid item>{form.fields.featured}</Grid>
    </Grid>
  );
});

FormOrganizationRoot.defaultProps = defaultProps;

export default FormOrganizationRoot;
