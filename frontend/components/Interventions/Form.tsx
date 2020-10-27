import React, { useEffect, useState } from "react";
import { ETKPanelProps } from "../Panel";
import useSchema from "./Schema";
import useETKForm from "../Form/useForm";
import { Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const ETKInterventionForm: React.FC<ETKPanelProps> = (props) => {

  const [step, setStep] = useState('validation');
  const schema = useSchema();

  const { fields, handleSubmit, setError, errors } = useETKForm({
    schema: schema,
  });

  const displayStepFields = (stepname: string) => 
    Object.keys(schema)
      .filter(item => schema[item].step === stepname)
      .map(item => <Grid>{fields[item]}</Grid>);

  return (
    <Grid container direction="column">
      {errors.general && (
        <Grid item>
          <Alert color="error">{errors.general?.message}</Alert>
        </Grid>
      )}
      {displayStepFields(step)}
    </Grid>
  );
}

export default ETKInterventionForm;
