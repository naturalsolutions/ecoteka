import React, { useEffect, useState } from "react";
import {
  TIntervention,
  useInterventionSchema,
} from "@/components/Interventions/Schema";
import { INTERVENTION_COLORS } from "@/components/Interventions/Calendar/index.d";
import {
  makeStyles,
  Grid,
  Button,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import useForm from "@/components/Form/useForm";

export interface CalendarInterventionProps {
  intervention: TIntervention;
}

const defaultProps: CalendarInterventionProps = {
  intervention: undefined,
};

const useStyles = makeStyles(() => ({
  root: {
    minWidth: "25rem",
  },
}));

const CalendarInterventionForm = (props) => {
  const router = useRouter();
  const [done, setDone] = useState<boolean>(
    props.intervention.done ? props.intervention.done : false
  );
  const schema = useInterventionSchema(props.intervention.intervention_type);
  const form = useForm({ schema });

  return (
    <Grid container direction="column">
      {Object.keys(form.fields).map((field) => (
        <Grid item key={`field-${field}`}>
          {form.fields[field]}
        </Grid>
      ))}
      <Grid item>
        <Grid container>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={done}
                  onChange={() => setDone(!done)}
                  color="primary"
                />
              }
              label="Done"
            />
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                props.dialog.current.close();
                router.push(`/edition/?tree=${props.intervention.tree_id}`);
              }}
            >
              Vue arbre
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const CalendarIntervention: React.FC<CalendarInterventionProps> = (props) => {
  const classes = useStyles();
  const { dialog } = useAppLayout();
  const { t } = useTranslation(["common", "components"]);
  const backgroundColor =
    INTERVENTION_COLORS[props.intervention.intervention_type];
  const schema = useInterventionSchema(props.intervention.intervention_type);
  const form = useForm({ schema });

  useEffect(() => {
    Object.keys(form.fields).map((field) => {
      if (schema[field].component.multiple) {
        form.setValue(field, [props.intervention[field]]);
      } else {
        form.setValue(field, props.intervention[field]);
      }
    });
  }, [form]);

  const handleInterventionDialog = () => {
    dialog.current.open({
      title: (
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs>
            <Button
              disabled
              fullWidth
              style={{
                color: "#fff",
                backgroundColor: backgroundColor,
              }}
            >
              {t(
                `components:Intervention.types.${props.intervention.intervention_type}`
              )}
            </Button>
          </Grid>
        </Grid>
      ),
      content: (
        <CalendarInterventionForm
          dialog={dialog}
          intervention={props.intervention}
        />
      ),
      actions: [
        {
          label: "Fermer",
        },
      ],
    });
  };

  return (
    <div
      onClick={handleInterventionDialog}
      style={{
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        width: "10px",
        height: "10px",
        marginRight: "2px",
      }}
    />
  );
};

CalendarIntervention.defaultProps = defaultProps;

export default CalendarIntervention;
