import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ETKPanelProps } from "@/components/Panel";
import {
  steps,
  schemaMap,
  TInterventionType,
  TInterventionStep,
} from "@/components/Interventions/Schema";
import useETKForm from "@/components/Form/useForm";
import {
  Button,
  Grid,
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { apiRest } from "@/lib/api";
import ETKMap from "@/components/Map/Map";
import { useAppContext } from "@/providers/AppContext";
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
  },
  label: {
    cursor: "pointer",
  },
  icon: {
    "&$activeIcon": {
      color: theme.palette.primary.main,
    },
    "&$completedIcon": {
      color: theme.palette.primary.main,
    },
  },
  activeIcon: {
    color: theme.palette.primary.main,
  },
  completedIcon: {},
}));

type ETKInterventionFormProps = {
  interventionType: TInterventionType;
  step: TInterventionStep;
  data: any;
  map: React.RefObject<ETKMap>;
  organization: any;
};

type ETKInterventionFormHandles = {
  submit: () => Promise<boolean>;
  getValues: () => any;
};

const commonsteps: TInterventionStep[] = [
  "interventionselection",
  "treeselection",
];

const ETKInterventionForm = forwardRef<
  ETKInterventionFormHandles,
  ETKInterventionFormProps
>((props, ref) => {
  const schema = schemaMap[props.step](props.interventionType);
  const form = useETKForm({ schema });

  useEffect(() => {
    const formfields = Object.keys(props.data).filter(
      (field) => field in schema
    );

    formfields.forEach((field) => {
      const value = props.data[field];

      if (schema[field].component.multiple === true && !Array.isArray(value)) {
        form.setValue(field, [value]);
      } else {
        form.setValue(field, value);
      }
    });

    props.map?.current?.map.on("click", (e) =>
      onMapClick(props.map.current.map, e)
    );

    return () => {
      props.map?.current?.map.off("click", onMapClick);
    };
  }, []);

  let valid = false;

  const submit = form.handleSubmit(
    (data, e) => {
      valid = true;
    },
    (errors, e) => {
      console.log(errors);
      valid = false;
    }
  );

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await submit();
      return valid;
    },
    getValues: () => {
      return form.getValues();
    },
  }));

  const onMapClick = (map, e) => {
    if (props.step === "treeselection") {
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5],
      ];
      var features = map.queryRenderedFeatures(bbox, {
        layers: [`ecoteka-${props.organization.slug}`],
      });

      if (features.length) {
        form.setValue("tree_id", features[0].properties.id);
      }
    }
  };

  return (
    <React.Fragment>
      {Object.keys(schema).map((item, idx) => (
        <Grid key={`form-${idx}`}>{form.fields[item]}</Grid>
      ))}
    </React.Fragment>
  );
});

const initialData = steps.reduce(
  (acc, step) => Object.assign(acc, { [step]: {} }),
  {}
);

const ETKInterventionFormStepper: React.FC<ETKPanelProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(["common", "components"]);
  const { user } = useAppContext();
  const [activestep, setActivestep] = useState(0);
  const [interventionType, setInterventionType] = useState<TInterventionType>(
    "pruning"
  );

  const [data, setData] = useState(initialData);
  const [formRefs, setFormRefs] = useState({});

  useEffect(() => {
    const refs = steps.reduce(
      (acc, step) =>
        Object.assign(acc, { [step]: formRefs[step] || createRef() }),
      {}
    );
    setFormRefs(refs);
  }, []);

  const setStepData = (step, stepData) => {
    setData(Object.assign(data, { [step]: stepData }));
  };

  const handleStepDataValidated = (step: TInterventionStep, stepData) => {
    if (
      step === "interventionselection" &&
      stepData.intervention_type !== interventionType
    ) {
      setInterventionType(stepData.intervention_type);
    }
  };

  const reset = () => {
    setData(initialData);
    setActivestep(0);
  };

  const submit = async () => {
    const dateRange = data["validation"].intervention_period;
    const payload = steps
      .filter((step) => step != "intervention")
      .reduce(
        (acc, step) => {
          return Object.assign(acc, data[step]);
        },
        {
          properties: data["intervention"],
          intervention_start_date: new Date(dateRange.startDate),
          intervention_end_date: new Date(dateRange.endDate),
        } // c'est moche !!
      );

    await apiRest.interventions.post(payload);
  };

  const handleNext = async (step: TInterventionStep) => {
    const form = formRefs[step].current;
    const isValid = await form.submit();

    if (isValid) {
      const formData = form.getValues();

      setStepData(step, formData);
      handleStepDataValidated(step, formData);

      if (steps.indexOf(step) === steps.length - 1) {
        await submit();
      }

      setActivestep(activestep + 1);
    }
  };

  const handlePrevious = async (step: TInterventionStep) => {
    const form = formRefs[step].current;
    const isValid = await form.submit();

    if (isValid) {
      const formData = form.getValues();

      setStepData(step, formData);
      handleStepDataValidated(step, formData);
    }

    // In case of previous, we go backward regardless of the form being valid
    setActivestep(activestep - 1);
  };

  return (
    <React.Fragment>
      <Typography variant="h5">{t("components:Intervention.title")}</Typography>
      <Stepper
        orientation="vertical"
        activeStep={activestep}
        className={classes.root}
      >
        {steps.map((step, stepidx) => (
          <Step key={step} className={classes.label}>
            <StepLabel
              StepIconProps={{
                classes: {
                  root: classes.icon,
                  active: classes.icon,
                  completed: classes.completedIcon,
                },
              }}
              onClick={(e) => stepidx < activestep && setActivestep(stepidx)}
            >
              {t(`components:Intervention.steps.${step}`)}
            </StepLabel>
            <StepContent>
              <Grid container direction="column">
                <ETKInterventionForm
                  ref={formRefs[step]}
                  data={data[step]}
                  interventionType={interventionType}
                  step={step}
                  map={props.context.map}
                  organization={user.currentOrganization}
                />
                <Grid container direction="row" justify="flex-end">
                  {activestep !== 0 && (
                    <Button onClick={() => handlePrevious(step)}>
                      {activestep === steps.length - 1
                        ? t("common:buttons.previous")
                        : t("common:buttons.previous")}
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => handleNext(step)}
                  >
                    {activestep === steps.length - 1
                      ? t("common:buttons.finish")
                      : t("common:buttons.next")}
                  </Button>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
        ))}
        <Step key="finish" className={classes.label}>
          <StepLabel
            StepIconProps={{
              classes: {
                root: classes.icon,
                active: classes.icon,
                completed: classes.completedIcon,
              },
            }}
          >
            {t(`components:Intervention.steps.finish`)}
          </StepLabel>
          <StepContent>
            <Grid container direction="column">
              <Grid>
                <Typography variant="h6">
                  {t(`components:Intervention.success`)}
                </Typography>
              </Grid>
              <Grid>
                <Typography>{t("components:Intervention.whatnow")}</Typography>
                <Grid container direction="row" justify="flex-end">
                  <Button>
                    <HomeIcon />
                  </Button>
                  <Button
                    onClick={(e) => reset()}
                    variant="contained"
                    color="primary"
                  >
                    <Typography variant="caption">
                      {t("components:Intervention.plannew")}
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
      </Stepper>
    </React.Fragment>
  );
};

export default ETKInterventionFormStepper;
