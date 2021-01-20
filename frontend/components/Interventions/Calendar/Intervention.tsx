import React, { useEffect } from "react";
import {
  TIntervention,
  useInterventionSchema,
} from "@/components/Interventions/Schema";
import { INTERVENTION_COLORS } from "@/components/Interventions/Calendar/index.d";
import { makeStyles, Grid, Button } from "@material-ui/core";
import { useAppLayout } from "@/components/AppLayout/Base";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import useForm from "@/components/Form/useForm";
import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import * as yup from "yup";

export interface CalendarInterventionProps {
  intervention: TIntervention;
  onSave?(intervention: TIntervention): void;
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
  const schema = useInterventionSchema(props.intervention.intervention_type);

  // hotfix : ideally defaultValues should be define from schema
  const defaultValues = {
    comment: "",
    method: "",
    done: false,
  };

  schema.done = {
    type: "switch",
    component: {
      label: "done",
      color: "primary",
    },
    schema: yup.boolean(),
  };

  const form = useForm({ schema, defaultValues });
  const { apiETK } = useApi().api;
  const { user } = useAppContext();

  useEffect(() => {
    Object.keys(form.fields)
      .filter((field) => field !== "done")
      .map((field) => {
        form.setValue(field, props.intervention.properties[field]);
      });

    // console.log(props.intervention.done);
    form.setValue("done", props.intervention.done);
  }, [form, props.intervention]);

  const handleOnSave = async () => {
    const organizationId = user.currentOrganization.id;
    const { done, ...properties } = form.getValues();

    const payload = {
      done,
      properties,
    };

    const { status, data: intervention } = await apiETK.patch(
      `/organization/${organizationId}/interventions/${props.intervention.id}`,
      payload
    );

    if (status === 200) {
      props.onSave(intervention);
    }
  };

  return (
    <Grid container direction="column">
      {Object.keys(form.fields)
        .filter((key) => key !== "done")
        .map((field) => (
          <Grid item key={`field-${field}`}>
            {form.fields[field]}
          </Grid>
        ))}
      <Grid item>
        <Grid container>
          <Grid item>{form.fields.done}</Grid>
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
      <Grid item>
        <Grid container>
          <Grid item>
            <Button onClick={handleOnSave}>Save</Button>
          </Grid>
          <Grid item xs />
          <Grid item>
            <Button onClick={() => props.dialog.current.close()}>Close</Button>
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
          onSave={props.onSave}
        />
      ),
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
