import React, { FC } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { Grid } from "@material-ui/core";
import CoreTextField from "@/components/Core/Field/TextField";
import CoreSelectField from "@/components/Core/Field/Select";
import useOrganizationSchema from "@/components/Admin/Organization/Schema";
import OSMNameField from "@/components/Admin/Organization/Field/OSMName";
import { useAdminOrganizationContext } from "@/components/Admin/Organization/Provider";

export interface AdminOrganizationBasicFormProps {
  readOnly: boolean;
}

export const fields = ["name", "mode", "owner_email", "osmname"];

const AdminOrganizationBasicForm: FC<AdminOrganizationBasicFormProps> = ({
  readOnly = true,
}) => {
  const organizationSchema = useOrganizationSchema();
  const { form } = useAdminOrganizationContext();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          {...organizationSchema.name}
          as={CoreTextField}
          name="name"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.name)}
          InputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...organizationSchema.owner_email}
          as={CoreTextField}
          name="ownerEmail"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.ownerEmail)}
          InputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...organizationSchema.mode}
          as={CoreTextField}
          name="mode"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.mode)}
          InputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          as={OSMNameField}
          inputProps={{
            ...organizationSchema.osmname.component,
            error: Boolean(form.errors?.osmname),
            InputProps: {
              readOnly,
            },
          }}
          name="osmname"
          defaultValue=""
          control={form.control}
        />
      </Grid>
    </Grid>
  );
};

export default AdminOrganizationBasicForm;
