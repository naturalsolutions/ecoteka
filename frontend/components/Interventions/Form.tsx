import React, { createRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ETKPanelProps } from "../Panel";
import { steps, schemaMap, TInterventionType, TInterventionStep } from "./Schema";
import useETKForm from "../Form/useForm";
import { Button, Grid, makeStyles, Step, StepContent, StepLabel, Stepper, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { apiRest } from '../../lib/api';

const useStyles = makeStyles(theme => ({
  root: {
    width: 400
  }
}));

type ETKInterventionFormProps = {
  interventiontype: TInterventionType;
  step: TInterventionStep;
  data: any
};

const commonsteps: TInterventionStep[] = ['interventionselection', 'treeselection'];

const ETKInterventionForm = forwardRef<{ submit, getValues }, ETKInterventionFormProps>(
  (props, ref) => {
    const schema = schemaMap[props.step](props.interventiontype);
    const form = useETKForm({ schema });

    useEffect(() => {
      const formfields = Object.keys(props.data).filter(field => field in schema);

      formfields.forEach(field => {
        const value = props.data[field];

        if ((schema[field].component.multiple === true) && (!Array.isArray(value))) {
          form.setValue(field, [value]);
        } else {
          form.setValue(field, value);
        }
      });
    }, []);

    let valid = false;

    const submit = form.handleSubmit(
      (data, e) => { valid = true; },
      (errors, e) => { valid = false; }
    );
    useImperativeHandle(ref, () => ({
      submit: async () => {
        await submit();
        return valid;
      },
      getValues: () => {
        return form.getValues();
      }
    }));
    return (
      <React.Fragment>
        {
          Object.keys(schema)
            .map(
              (item, idx) => (
                <Grid key={`form-${idx}`}>
                  {form.fields[item]}
                </Grid>
              )
            )
        }
      </React.Fragment>
    );
  });

const ETKInterventionFormStepper: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['common', 'components']);

  const [activestep, setActivestep] = useState(3);
  const [interventiontype, setInterventiontype] = useState<TInterventionType>('pruning');

  const initialdata = steps.reduce(
    (acc, step) => Object.assign(acc, { [step]: {} }),
    {}
  );
  const [data, setData] = useState(initialdata);
  const [formRefs, setFormRefs] = useState({});
  useEffect(() => {
    const refs = steps.reduce(
      (acc, step) => Object.assign(acc, { [step]: formRefs[step] || createRef() }),
      {}
    );
    setFormRefs(refs);
  }, []);

  const setStepdata = (step, stepdata) => {
    setData(Object.assign(data, { [step]: stepdata }))
  }

  const handleStepDataValidated = (step: TInterventionStep, stepdata) => {
    if (step === 'interventionselection' && stepdata.intervention_type !== interventiontype) {
      setInterventiontype(stepdata.intervention_type);
    }
  }

  const reset = () => {
    setData(initialdata);
    setActivestep(0);
  }
  const submit = async () => {
    const payload = steps.filter(step => step != 'intervention')
      .reduce(
        (acc, step) => {
          return Object.assign(acc, data[step]);
        },
        { properties: data['intervention'] }
      );

    const response = await apiRest.interventions.post(payload);
  }

  const handleNext = async (step: TInterventionStep) => {
    const form = formRefs[step].current;
    const isvalid = await form.submit();

    if (isvalid) {
      const formdata = form.getValues();
      setStepdata(step, formdata);
      handleStepDataValidated(step, formdata);

      if (steps.indexOf(step) === steps.length - 1) {
        console.log('submiting');
        await submit();
      }
      setActivestep(activestep + 1);
    }
  }
  const handlePrevious = async (step: TInterventionStep) => {
    const form = formRefs[step].current;
    const isvalid = await form.submit();

    if (isvalid) {
      const formdata = form.getValues();
      setStepdata(step, formdata);
      handleStepDataValidated(step, formdata);
    }

    setActivestep(activestep - 1); //In case of previous, we go backward regardless of the form being valid
  }

  return (
    <React.Fragment>
    <Typography variant="h5">{t('components:Intervention.title')}</Typography>
    <Stepper orientation="vertical" activeStep={activestep} className={classes.root}>
      {steps.map(step =>
        <Step key={step}>
          <StepLabel>{t(`components:Intervention.steps.${step}`)}</StepLabel>
          <StepContent>
            <Grid container direction="column">
              <ETKInterventionForm
                ref={formRefs[step]}
                data={data[step]}
                interventiontype={interventiontype}
                step={step}
              />
              <Grid container direction="row" justify="flex-end">
                {activestep !== 0 && (
                  <Button onClick={() => handlePrevious(step)}>{t('common:buttons.previous')}</Button>
                )}
                <Button color="primary" variant="contained" onClick={() => handleNext(step)}>
                  {activestep === steps.length - 1 ? t('common:buttons.finish') : t('common:buttons.next')}
                </Button>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
      )}
      <Step key="finish">
        <StepLabel>{t(`components:Intervention.steps.finish`)}</StepLabel>
        <StepContent>
          <Grid container direction="column">
            <Grid>
              <Typography variant="h6">{t(`components:Intervention.success`)}</Typography>
            </Grid>
            <Grid>
              <Typography>{t('components:Intervention.whatnow')}</Typography>
              <Grid container direction="row" justify="flex-end">
                <Button>
                  <Typography variant="caption">{t('common:buttons.backToHome')}</Typography>
                </Button>
                <Button
                  onClick={e => reset()}
                  variant="contained"
                  color="primary"
                >
                  <Typography variant="caption">{t('components:Intervention.plannew')}</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </StepContent>
      </Step>
    </Stepper>
    </React.Fragment>
  )
}

export default ETKInterventionFormStepper;
