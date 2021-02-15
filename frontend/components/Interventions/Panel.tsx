import { FC, useEffect, useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import useApi from "@/lib/useApi";
import { DateRangePeriod } from "@/components/Form/useDateRange";
import { useAppContext } from "@/providers/AppContext";
import { useSnackbar } from "notistack";
import {
  TIntervention,
  useInterventionSchema,
  usePlanningSchema,
} from "./Schema";
import useETKForm from "@/components/Form/useForm";
interface IInterventionEditProps {}

interface IInterventionResponse {
  status: number;
  data: TIntervention;
}

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
  const { user } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();

  const { fields, getValues, setValue } = useETKForm({ schema });

  const handleOnSave = async () => {
    try {
      const values = getValues();
      const organizationId = user.currentOrganization.id;
      const payload = {
        id: intervention.id,
        organization_id: intervention.organization_id,
        intervention_type: intervention.intervention_type,
        tree_id: intervention.tree_id,
        properties: {},
      };
      const nonPropertiesFields = [
        "intervenant",
        "date",
        "done",
        "estimated_cost",
        "required_documents",
        "required_material",
      ];

      for (let key in values) {
        if (key === "intervention_period") {
          const interventionPeriod: DateRangePeriod =
            values["intervention_period"];
          payload["intervention_start_date"] = interventionPeriod.startDate;
          payload["intervention_end_date"] = interventionPeriod.endDate;
        } else if (nonPropertiesFields.includes(key)) {
          payload[key] = values[key];
        } else {
          payload.properties[key] = values[key];
        }
      }

      const { status } = await apiETK.patch(
        `/organization/${organizationId}/interventions/${id}`,
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

    setValue("intervention_period", {
      startDate: new Date(intervention.intervention_start_date),
      endDate: new Date(intervention.intervention_end_date),
    });
  }, []);

  useEffect(() => {
    if (saving) {
      handleOnSave();
    }
  }, [saving]);

  const mapFields = (field) => {
    return <Grid item>{fields[field]}</Grid>;
  };

  return (
    <Grid container spacing={1} direction="column">
      {Object.keys(fields).map(mapFields)}
    </Grid>
  );
};

const InterventionsEdit: FC<IInterventionEditProps> = () => {
  const { t } = useTranslation("components");
  const { user } = useAppContext();
  const router = useRouter();
  const { apiETK } = useApi().api;
  const [intervention, setIntervention] = useState<TIntervention>();
  const [saving, setSaving] = useState<boolean>(false);

  const getIntervention = async (intervertionId: number) => {
    try {
      const organizationId = user.currentOrganization.id;
      const url = `/organization/${organizationId}/interventions/${intervertionId}`;
      const { status, data }: IInterventionResponse = await apiETK.get(url);

      if (status === 200) {
        setIntervention(data);
      }
    } catch (e) {}
  };

  const handleOnBackToTree = () => {
    if (intervention?.tree_id) {
      router.push(`/map?panel=info&tree=${intervention.tree_id}`);
    }
  };

  const handleOnSave = () => {
    setSaving(true);
  };

  useEffect(() => {
    if (!intervention?.tree_id) {
      const interventionId = Number(router.query?.intervention);
      getIntervention(interventionId);
    }
  }, [router?.query?.tree]);

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="h6">
          {t("components.Interventions.Edit.title")}:{" "}
          {
            t("components.Intervention.types", { returnObjects: true })[
              intervention?.intervention_type
            ]
          }
        </Typography>
      </Grid>
      <Grid item>
        <Grid container>
          <Button color="primary" onClick={handleOnBackToTree}>
            {t("components.TreeForm.backToInfo")}
          </Button>
          <Grid item xs />
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleOnSave()}
          >
            {t("common.buttons.save")}
          </Button>
        </Grid>
        <Grid item>
          <InterventionEditForm
            intervention={intervention}
            saving={saving}
            onSave={() => setSaving(false)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InterventionsEdit;
