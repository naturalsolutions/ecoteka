import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import {
  TIntervention,
  useInterventionSchema,
  useDateSchema,
} from "@/components/Interventions/Schema";
import useETKForm from "@/components/Form/useForm";
import { Grid } from "@material-ui/core";

interface IInterventionArchiveForm {
  intervention: TIntervention;
  saving: boolean;
  onSave(): void;
}

const InterventionArchiveForm: FC<IInterventionArchiveForm> = ({
  intervention,
  saving,
  onSave,
}) => {
  if (!intervention) {
    return null;
  }
  const { t } = useTranslation("components");
  const { id } = intervention;
  const doneSchema = useDateSchema();
  const schema = { ...doneSchema };
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const { fields, getValues, setValue } = useETKForm({ schema });

  const handleOnSave = async () => {
    try {
      const values = getValues();
      const payload = {
        id: intervention.id,
        organization_id: organization.id,
        intervention_type: intervention.intervention_type,
        tree_id: intervention.tree_id,
        done: true,
        properties: {},
      };
      const nonPropertiesFields = [
        "intervenant",
        "date",
        "done",
        "cancelled",
        "estimated_cost",
        "required_documents",
        "required_material",
        "intervention_start_date",
        "intervention_end_date",
      ];

      for (let key in values) {
        if (nonPropertiesFields.includes(key)) {
          payload[key] = values[key];
        } else {
          payload.properties[key] = values[key];
        }
      }

      const { status } = await apiETK.patch(
        `/organization/${organization.id}/interventions/${id}`,
        payload
      );

      if (status === 200) {
        enqueueSnackbar(t("components.Intervention.saveSuccess"), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      }
    } catch (e) {
      enqueueSnackbar(t("components.Intervention.saveError"), {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } finally {
      onSave();
    }
  };

  useEffect(() => {
    Object.keys(intervention).forEach((i) => {
      const dateProperties = [
        "intervention_start_date",
        "intervention_end_date",
      ];

      if (!dateProperties.includes(i)) {
        setValue(i, intervention[i]);
      }
    });

    Object.keys(intervention.properties).forEach((i) => {
      setValue(i, intervention.properties[i]);
    });
    setValue("done", true);
    setValue("cancelled", false);
    setValue("date", Date.now());
  }, []);

  useEffect(() => {
    if (saving) {
      handleOnSave();
    }
  }, [saving]);

  const mapFields = (field, index) => {
    return (
      <Grid item key={`${index}-${field}`}>
        {fields[field]}
      </Grid>
    );
  };

  return (
    <Grid container spacing={1} direction="column">
      {Object.keys(fields).map(mapFields)}
    </Grid>
  );
};

export default InterventionArchiveForm;
