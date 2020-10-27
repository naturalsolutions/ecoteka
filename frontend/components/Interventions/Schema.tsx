import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useInterventionSchema() {
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
        items: [
          {label: "dict", value: "dict"},
          {label: "police de roulage", value: "police_de_roulage"}
        ]
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    required_material: {
      step: "validation",
      type: "select",
      component: {
        multiple: true,
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