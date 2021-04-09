import React, { FC } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { Grid, InputAdornment } from "@material-ui/core";
import CoreTextField from "@/components/Core/Field/TextField";
import CoreSwitch from "@/components/Core/Field/Switch";
import useTreeSchema from "@/components/Tree/Schema";
import TreeCanonicalField from "./Field/Canonical";

export interface TreeBasicFormProps {
  readOnly: boolean;
  form: UseFormMethods;
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

const TreeBasicForm: FC<TreeBasicFormProps> = ({ readOnly = true, form }) => {
  const treeSchema = useTreeSchema();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          as={TreeCanonicalField}
          inputProps={{
            ...treeSchema.canonicalName.component,
            error: Boolean(form.errors?.canonicalName),
            InputProps: {
              readOnly,
            },
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
          InputProps={{ readOnly }}
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
              InputProps={{ readOnly }}
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
              InputProps={{ readOnly }}
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
          InputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...treeSchema.plantationDate.component}
          as={CoreTextField}
          name="plantationDate"
          control={form.control}
          defaultValue=""
          error={Boolean(form.errors?.plantationDate)}
          InputProps={{ readOnly }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          {...treeSchema.isTreeOfInterest.component}
          name="isTreeOfInterest"
          control={form.control}
          as={CoreSwitch}
          defaultValue={false}
          switchProps={{ readOnly }}
        />
      </Grid>
    </Grid>
  );
};

export default TreeBasicForm;
