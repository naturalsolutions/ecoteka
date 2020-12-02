import React, { forwardRef, useImperativeHandle } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import useCoordSchema from "@/components/Coord/Schema";
import useForm from "@/components/Form/useForm";

export interface CoordFormProps {
  submit: () => Promise<boolean>;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const CoordForm = forwardRef<{ submit }, {}>((props, ref) => {
  const classes = useStyles();
  const schema = useCoordSchema();
  const { fields, getValues, handleSubmit } = useForm({ schema });

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit((data) => data);
    },
  }));

  return (
    <Grid container direction="column">
      <Grid item>{fields.lng}</Grid>
      <Grid item>{fields.lat}</Grid>
    </Grid>
  );
});

export default CoordForm;
