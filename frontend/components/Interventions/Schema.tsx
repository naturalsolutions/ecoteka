import * as yup from "yup";
import { useTranslation } from "react-i18next";

export type TInterventionType =
  | "pruning"
  | "felling"
  | "streanremoval"
  | "indepthdiagnostic"
  | "treatment"
  | "surveillance";

export interface TIntervention {
  date?: Date | null;
  done: boolean;
  estimated_cost: number;
  id?: number;
  intervenant: string;
  intervention_end_date?: Date;
  intervention_start_date?: Date;
  intervention_type: TInterventionType;
  organization_id?: number;
  properties: any;
  required_documents: string[];
  required_material: string[];
  tree_id: number;
}

export const interventionTypes: TInterventionType[] = [
  "pruning",
  "felling",
  "streanremoval",
  "indepthdiagnostic",
  "treatment",
  "surveillance",
];

export type TRequiredMaterial =
  | "soil"
  | "pole"
  | "climb"
  | "ladder"
  | "raiser"
  | "retentionkit"
  | "foot"
  | "pull"
  | "trimmer"
  | "crane"
  | "coredrill"
  | "crunchy"
  | "mecanicshovel"
  | "canon"
  | "watering"
  | "amendment"
  | "tutorrefection"
  | "colletprotection"
  | "scald"
  | "globalcheck";

export const requiredMaterials: TRequiredMaterial[] = [
  "pole",
  "climb",
  "ladder",
  "raiser",
  "retentionkit",
  "foot",
  "pull",
  "trimmer",
  "crane",
  "coredrill",
  "crunchy",
  "mecanicshovel",
  "canon",
  "watering",
  "amendment",
  "tutorrefection",
  "colletprotection",
  "scald",
  "globalcheck",
];

export type TRequiredDocuments = "dt" | "trafficpolice";
export const requiredDocuments: TRequiredDocuments[] = ["dt", "trafficpolice"];

const requiredMaterial: { [t in TInterventionType]: TRequiredMaterial[] } = {
  pruning: ["pole", "climb", "ladder", "raiser", "retentionkit"],
  felling: [
    "foot",
    "pull",
    "retentionkit",
    "climb",
    "ladder",
    "raiser",
    "crane",
  ],
  streanremoval: ["trimmer", "coredrill", "crunchy", "mecanicshovel"],
  indepthdiagnostic: ["soil", "climb", "ladder", "raiser"],
  treatment: ["soil", "climb", "canon"],
  surveillance: [
    "watering",
    "amendment",
    "tutorrefection",
    "colletprotection",
    "scald",
    "globalcheck",
  ],
};

const interventionMethod: { [it in TInterventionType]: string[] } = {
  indepthdiagnostic: [
    "resistograph",
    "tomograph",
    "computing",
    "tractiontest",
    "penetrometer",
  ],
  surveillance: ["watering", "amendment", "tutorcheck", "globalcheck"],
  treatment: ["auxilaryrelease", "biologictreatment"],
  streanremoval: ["drilling", "trimming", "grubbing"],
  felling: ["live", "rentention", "unmounting"],
  pruning: [
    "pruning",
    "carpenterremoval",
    "lightning",
    "maintenance",
    "crownraising",
  ],
};

function sitem(value, t, tpath) {
  return {
    value,
    label: t(`${tpath}.${value}`),
  };
}

function requiredDocumentsItems(it: TInterventionType, t) {
  return ["dt", "trafficpolice"].map((item) =>
    sitem(item, t, "components.Intervention.documents")
  );
}

function requiredMaterialItems(it: TInterventionType, t) {
  return requiredMaterial[it].map((item) =>
    sitem(item, t, "components.Intervention.material")
  );
}

export const interventionSteps = ["selection", "validation"];

export function useSelectionSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);

  return {
    intervention_type: {
      type: "select",
      component: {
        required: true,
        label: t("components.Intervention.intervention_type"),
        items: interventionTypes.map((it) =>
          sitem(it, t, "components.Intervention.types")
        ),
      },
      schema: yup.string().required(t("common.errors.required")),
    },
  };
}

export function useTreeSelectionSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);

  return {
    tree_id: {
      type: "textfield",
      component: {
        type: "number",
        defaultValue: null,
        required: true,
        label: t("components.Intervention.tree_id"),
        InputLabelProps: {
          shrink: true,
        },
      },
      schema: yup.number().required(t("common.errors.required")),
    },
  };
}

export function useInterventionSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);
  const interventionSchemas: { [it in TInterventionType]: any } = {
    pruning: {
      method: {
        type: "select",
        component: {
          label: t("components.Intervention.pruning.method"),
          items: interventionMethod.pruning.map((m) =>
            sitem(m, t, "components.Intervention.pruning")
          ),
        },
        schema: yup.string().required(t("common.errors.required")),
      },
      comment: {
        type: "textfield",
        component: {
          label: t("components.Intervention.pruning.comment"),
        },
        schema: yup.string(),
      },
    },
    felling: {
      method: {
        type: "select",
        component: {
          required: true,
          label: t("components.Intervention.felling.method"),
          items: interventionMethod.felling.map((m) =>
            sitem(m, t, "components.Intervention.felling")
          ),
        },
        schema: yup.string().required(t("common.errors.required")),
      },
      comment: {
        type: "textfield",
        component: {
          label: t("components.Intervention.felling.comment"),
        },
        schema: yup.string(),
      },
    },
    streanremoval: {
      streandiameter: {
        type: "textfield",
        component: {
          type: "number",
          label: t("components.Intervention.streanremoval.diameter"),
          InputProps: { inputProps: { min: 0 } },
        },
        schema: yup
          .number()
          .positive()
          .transform((value) => (isNaN(value) ? null : value)),
      },
      method: {
        type: "select",
        component: {
          label: t("components.Intervention.streanremoval.method"),
          items: interventionMethod.streanremoval.map((m) =>
            sitem(m, t, "components.Intervention.streanremoval")
          ),
        },
        schema: yup.string().required(t("common.errors.required")),
      },
    },
    surveillance: {
      method: {
        type: "multiselect",
        component: {
          label: t("components.Intervention.surveillance.method"),
          items: interventionMethod.surveillance.map((m) =>
            sitem(m, t, "components.Intervention.surveillance")
          ),
        },
        schema: yup
          .array()
          .of(yup.string())
          .required(t("common.errors.required")),
      },
      comment: {
        type: "textfield",
        component: {
          label: t("components.Intervention.surveillance.comment"),
        },
        schema: yup.string(),
      },
    },
    treatment: {
      method: {
        type: "select",
        component: {
          required: true,
          label: t("components.Intervention.treatment.method"),
          items: interventionMethod.treatment.map((m) =>
            sitem(m, t, "components.Intervention.treatment")
          ),
        },
        schema: yup.string().required(t("common.errors.required")),
      },
      disease: {
        type: "textfield",
        component: {
          required: true,
          label: t("components.Intervention.treatment.disease"),
        },
        schema: yup.string().required(t("common.errors.required")),
      },
      comment: {
        type: "textfield",
        component: {
          label: t("components.Intervention.treatment.comment"),
        },
        schema: yup.string(),
      },
    },
    indepthdiagnostic: {
      method: {
        type: "multiselect",
        component: {
          label: t("components.Intervention.indepthdiagnostic.method"),
          items: interventionMethod.indepthdiagnostic.map((m) =>
            sitem(m, t, "components.Intervention.indepthdiagnostic")
          ),
        },
        schema: yup
          .array()
          .of(yup.string())
          .required(t("common.errors.required")),
      },
      comment: {
        type: "textfield",
        component: {
          label: t("components.Intervention.indepthdiagnostic.comment"),
        },
        schema: yup.string(),
      },
    },
  };

  return interventionSchemas[it];
}

export function usePlanningSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);

  return {
    intervention_period: {
      type: "daterange",
      component: {
        label: t("components.Intervention.intervention_period"),
      },
      schema: yup
        .object({
          startDate: yup.string(),
          endDate: yup.string(),
        })
        .required(t("common.errors.required")),
    },
    estimated_cost: {
      type: "textfield",
      component: {
        label: t("components.Intervention.estimated_cost"),
        defaultValue: 0,
        type: "number",
        InputProps: {
          inputProps: {
            min: 0,
          },
        },
      },
      schema: yup.number().moreThan(-1),
    },
    required_documents: {
      type: "multiselect",
      component: {
        label: t("components.Intervention.required_documents"),
        items: requiredDocumentsItems(it, t),
      },
      schema: yup.array().of(yup.string()),
    },
    required_material: {
      type: "multiselect",
      component: {
        items: requiredMaterialItems(it, t),
        label: t("components.Intervention.required_material"),
      },
      schema: yup.array().of(yup.string()),
    },
    intervenant: {
      type: "textfield",
      component: {
        label: t("components.Intervention.intervenant"),
      },
      schema: yup.string(),
    },
  };
}

export function useDateSchema() {
  const { t } = useTranslation();
  const tomorow = new Date(Date.now() + 86400000);

  return {
    date: {
      type: "date",
      component: {
        label: t("components.Intervention.date"),
      },
      schema: yup
        .date()
        .required(t("common.errors.date.required"))
        .max(tomorow, t("common.errors.date.noFuture")),
    },
  };
}

export function useArchiveSchema() {
  const { t } = useTranslation();

  return {
    cancelNotes: {
      type: "textfield",
      component: {
        label: t("components.Intervention.cancelNotes"),
        multiline: true,
        rows: 4,
      },
      schema: yup.string(),
    },
  };
}

export type TInterventionStep =
  | "interventionselection"
  | "intervention"
  | "validation";

export const steps: TInterventionStep[] = [
  "interventionselection",
  "intervention",
  "validation",
];

export const schemaMap = {
  interventionselection: useSelectionSchema,
  intervention: useInterventionSchema,
  validation: usePlanningSchema,
};
