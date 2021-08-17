import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

import useApi from "@/lib/useApi";
import { useAppContext } from "@/providers/AppContext";
import {
  TIntervention,
  useInterventionSchema,
  usePlanningSchema,
} from "@/components/Interventions/Schema";
import useETKForm from "@/components/Form/useForm";
import { Grid } from "@material-ui/core";

interface IInterventionEditForm {
  intervention: TIntervention;
  saving: boolean;
  onSave(): void;
}

const InterventionEditForm: FC<IInterventionEditForm> = ({
  intervention,
  saving,
  onSave,
}) => {
  if (!intervention) {
    return null;
  }
  const { t } = useTranslation("components");
  const { intervention_type, id } = intervention;
  const interventionSchema = useInterventionSchema(intervention_type);
  const planningSchema = usePlanningSchema(intervention_type);
  const schema = { ...interventionSchema, ...planningSchema };
  const { apiETK } = useApi().api;
  const { organization } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const { fields, getValues, setValue } = useETKForm({ schema });

  const nonPropertiesFields = [
    "intervenant",
    "date",
    "done",
    "estimated_cost",
    "required_documents",
    "required_material",
    "intervention_start_date",
  ];

  const handleOnSave = async () => {
    try {
      const values = getValues();
      console.log(values);
      const payload = {
        id: intervention.id,
        organization_id: organization.id,
        intervention_type: intervention.intervention_type,
        tree_id: intervention.tree_id,
        properties: intervention.properties,
      };

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
    console.log(intervention);
    Object.keys(intervention).map((key) => {});
    Object.keys(intervention).forEach((i) => {
      if (nonPropertiesFields.includes(i)) {
        setValue(i, intervention[i]);
      }
    });

    Object.keys(intervention.properties).forEach((i) => {
      setValue(i, intervention.properties[i]);
    });
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

  const mapFieldsOrder = [
    "method",
    "intervention_start_date",
    "estimated_cost",
    "required_documents",
    "required_material",
    "intervenant",
    "comment",
  ];

  return (
    <Grid container spacing={1} direction="column">
      {mapFieldsOrder.map(mapFields)}
    </Grid>
  );
};

export default InterventionEditForm;
