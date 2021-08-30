import React, { FC } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { Grid } from "@material-ui/core";
import CoreTextField from "@/components/Core/Field/TextField";
import CoreSwitch from "@/components/Core/Field/Switch";
import DatePicker from "@/components/Core/Field/DatePicker";
import useTreeSchema from "@/components/Tree/Schema";
import TreeCanonicalField from "./Field/Canonical";
import { useTreeContext } from "@/components/Tree/Provider";

export interface TreeBasicFormProps {
  isEditable?: boolean;
}

export const fields = [
  "canonicalName",
  "vernacularName",
  "height",
  "diameter",
  "address",
  "plantationDate",
  "isTreeOfInterest",
];

const TreeBasicForm: FC<TreeBasicFormProps> = ({ isEditable = true }) => {
  const treeSchema = useTreeSchema();
  const { form } = useTreeContext();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          as={TreeCanonicalField}
          inputProps={{
            ...treeSchema.canonicalName.component,
            error: Boolean(form.errors?.canonicalName),
            disabled: !isEditable,
          }}
          name="canonicalName"
          defaultValue=""
          control={form.control}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...treeSchema.vernacularName.component}
          as={CoreTextField}
          name="vernacularName"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.vernacularName)}
          inputProps={{ disabled: !isEditable }}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              {...treeSchema.height.component}
              as={CoreTextField}
              name="height"
              control={form.control}
              defaultValue=""
              error={Boolean(form.errors?.height)}
              inputProps={{ disabled: !isEditable }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              {...treeSchema.diameter.component}
              as={CoreTextField}
              name="diameter"
              control={form.control}
              defaultValue=""
              error={Boolean(form.errors?.diameter)}
              inputProps={{ disabled: !isEditable }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...treeSchema.address.component}
          as={CoreTextField}
          name="address"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.address)}
          inputProps={{ disabled: !isEditable }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          as={
            <DatePicker
              inputProps={{
                ...treeSchema.plantationDate.component,
                error: Boolean(form.errors?.plantationDate),
                disabled: !isEditable,
              }}
            />
          }
          name="plantationDate"
          control={form.control}
          defaultValue=""
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...treeSchema.isTreeOfInterest.component}
          name="isTreeOfInterest"
          control={form.control}
          as={CoreSwitch}
          defaultValue={false}
          switchProps={{ disabled: !isEditable }}
        />
      </Grid>
    </Grid>
  );
};

export default TreeBasicForm;
