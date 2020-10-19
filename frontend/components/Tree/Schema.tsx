import * as yup from "yup";
import { useTranslation } from "react-i18next";


export default function useTreeSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    family: {
      type: "select",
      component: {
        label: t("components:Tree.family"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    gender: {
      type: "select",
      component: {
        label: t("components:Tree.gender"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    specie: {
      type: "select",
      component: {
        label: t("components:Tree.specie"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    cultivar: {
      type: "select",
      component: {
        label: t("components:Tree.cultivar")
      },
      schema: yup.string()
    },
    vernacularName: {
      type: "textfield",
      component: {
        label: t("components:Tree.latinName"),
        required: true
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    y: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.latitude"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    x: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.longitude"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    townshipCode: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.townshipCode")
      },
      schema: yup.string()
    },
    zipCode: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.zipCode")
      },
      schema: yup.string()
    },
    address: {
      type: "textfield",
      component: {
        label: t("components:Tree.address")
      },
      schema: yup.string()
    },
    zone: {
      type: "textfield",
      component: {
        label: t("components:Tree.zone"),
      },
      schema: yup.string()
    },
    etkRegistrationNumber: {
      type: "select",
      component: {
        label: t("components:Tree.etkRegistrationNumber"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    registrationNumber: {
      type: "select",
      component: {
        label: t("components:Tree.registrationNumber")
      },
      schema: yup.string()
    },
    plantingDate: {
      type: "textfield",
      component: {
        type: "date",
        label: t("components:Tree.plantingDate"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    height: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.height"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    diameter: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.diameter"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    soilType: {
      type: "select",
      component: {
        label: t("components:Tree.soilType")
      },
      schema: yup.string()
    },
    rootType: {
      type: "select",
      component: {
        label: t("components:Tree.rootType")
      },
      schema: yup.string()
    },
    habit: {
      type: "select",
      component: {
        label: t("components:Tree.habit")
      },
      schema: yup.string()
    },
    protected: {
      type: "checkbox",
      component: {
        label: t("components:Tree.protected")
      },
      schema: yup.string()
    },
    soilConstraints: {
      type: "select",
      component: {
        multiple: true,
        label: t("components:Tree.soilConstraints")
      },
      schema: yup.string()
    },
    aerianConstraint: {
      type: "checkbox",
      component: {
        label: t("components:Tree.aerianConstraint")
      },
      schema: yup.string()
    },
    lightning: {
      type: "checkbox",
      component: {
        label: t("components:Tree.lightning")
      },
      schema: yup.string()
    },
    watering: {
      type: "select",
      component: {
        multiple: true,
        label: t("components:Tree.watering")
      },
      schema: yup.string()
    },
    allergens: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Tree.allergens")
      },
      schema: yup.string()
    },
    remarks: {
      type: "textfield",
      component: {
        label: t("components:Tree.remarks")
      },
      schema: yup.string()
    }
  };
}
