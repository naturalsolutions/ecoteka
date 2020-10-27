import * as yup from "yup";
import { useTranslation } from "react-i18next";

export type TInterventionType = 
  "pruning"
  | "felling"
  | "strean_removal" 
  | "in_depth_diagnostic"
  | "treatment"
  | "surveillance";

export type TRequiredMaterial = 'soil'
  | 'pole'
  | 'climb'
  | 'ladder'
  | 'raiser'
  | 'retentionkit'
  | 'foot'
  | 'pull'
  | 'trimmer'
  | 'crane'
  | 'coredrill'
  | 'crunchy'
  | 'mecanicshovel'
  | 'canon'
  | 'watering'
  | 'amendment'
  | 'tutorrefection'
  | 'colletprotection'
  | 'scald'
  | 'lattersurveillance';

export type TRequiredDocuments = 'dt' | 'trafficpolice';

const requiredMaterial: {[t in TInterventionType]: TRequiredMaterial[]} = {
  pruning: [
    'pole',
    'climb',
    'ladder',
    'raiser',
    'retentionkit'
  ],
  felling: [
    'foot',
    'pull',
    'retentionkit',
    'climb',
    'ladder',
    'raiser',
    'crane'
  ],
  strean_removal: [
    'trimmer',
    'coredrill',
    'crunchy',
    'mecanicshovel'
  ],
  in_depth_diagnostic: [
    'soil',
    'climb',
    'ladder',
    'raiser'
  ],
  treatment: [
    'soil',
    'climb',
    'canon'
  ],
  surveillance: [
    'watering',
    'amendment',
    'tutorrefection',
    'colletprotection',
    'scald',
    'lattersurveillance'
  ]
};

function requiredDocumentsItems (it: TInterventionType, t) {
  return ['dt', 'trafficpolice']
    .map(item => Object({value: item, label: t(`components:Intervention.documents.${item}`)}) )
}

function requiredMaterialItems(it: TInterventionType, t) {
  return requiredMaterial[it]
    .map(item => Object({value: item, label: t(`components:Intervention.material.${item}`)}))
}

export default function useInterventionSchema(it: TInterventionType) {
  const { t } = useTranslation(["common", "components"]);

  return {
    plan_date_interval: {
      step: "validation",
      type: "daterange",
      component: {
        label: t("components:Intervention.plan_date_interval"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    estimated_cost: {
      step: "validation",
      type: "number",
      component: {
        label: t("components:Intervention.estimated_cost"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    required_documents: {
      step: "validation",
      type: "select",
      component: {
        multiple: true,
        label: t("components:Intervention.required_documents"),
        items: requiredDocumentsItems(it, t)
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    required_material: {
      step: "validation",
      type: "select",
      component: {
        multiple: true,
        items: requiredMaterialItems(it, t),
        label: t("components:Intervention.required_material")
      },
      schema: yup.string().required(t("common:errors.required"))
    },
    intervenant: {
      step: "validation",
      type: "textfield",
      component: {
        label: t("components:Intervention.intervenant")
      },
      schema: yup.string().required(t("common:errors.required"))
    }
  }
}