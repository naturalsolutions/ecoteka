import React, { useEffect, useState } from "react";
import { ETKPanelProps } from "../Panel";
import useSchema, { interventionSteps } from "./Schema";
import useETKForm from "../Form/useForm";
import { Button, Grid, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const ETKInterventionForm: React.FC<ETKPanelProps> = (props) => {
  const [step, setStep] = useState(interventionSteps[0]);
  const schema = useSchema('pruning');

  const { fields, handleSubmit, setError, errors } = useETKForm({
    schema: schema,
  });

  const displayStepFormFields = () => {
    const stepfields = Object.keys(schema);

    return (
      <React.Fragment>
        {
          stepfields
          .filter(item => schema[item].step === step)
          .map(
            (item, idx) => (
              <Grid key={`form-${step}-${idx}`}>
                <Typography variant="h6">{schema[item].component.label}</Typography>
                {fields[item]}
              </Grid>
            )
          )
        }
      </React.Fragment>
    )
  }
  const displayStepFormControls = () => {
    const idx = interventionSteps.indexOf(step);

    return (
      <Grid container alignItems="flex-end" direction="row">
        {
          (idx !== 0) && 
          <Button
            variant="outlined"
            onClick={()=> setStep(interventionSteps[idx-1])}
          >
            precedant
          </Button>
        }
        {
          (idx !== interventionSteps.length -1) &&
          <Button
            variant="contained"
            onClick={()=> setStep(interventionSteps[idx+1])}
          >
            Suivant
          </Button>
        }
      </Grid>
    );
  }

  return (
    <Grid container direction="column">
      {errors.general && (
        <Grid item>
          <Alert color="error">{errors.general?.message}</Alert>
        </Grid>
      )}
      {displayStepFormFields()}
      {displayStepFormControls()}
    </Grid>
  );
}

export default ETKInterventionForm;
