import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useTreeSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    family: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.family"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    gender: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.gender"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    specie: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.specie"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    cultivar: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.cultivar"),
      },
      schema: yup.string(),
    },
    vernacularName: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.latinName"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    y: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.latitude"),
      },
      schema: yup.number().required(t("common:errors.required")),
    },
    x: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.longitude"),
      },
      schema: yup.number().required(t("common:errors.required")),
    },
    townshipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.townshipCode"),
      },
      schema: yup.string(),
    },
    zipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.zipCode"),
      },
      schema: yup.string(),
    },
    address: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.address"),
      },
      schema: yup.string(),
    },
    zone: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.zone"),
      },
      schema: yup.string(),
    },
    etkRegistrationNumber: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.etkRegistrationNumber"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    registrationNumber: {
      type: "select",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.registrationNumber"),
      },
      schema: yup.string(),
    },
    plantingDate: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.plantingDate"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    height: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components:Tree.height"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    diameter: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components:Tree.diameter"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    soilType: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.soilType"),
        items: [
          { label: "Argileux", value: "Argileux" },
          { label: "Limoneux", value: "Limoneux" },
          { label: "Calcaire", value: "Calcaire" },
          { label: "Sableux", value: "Sableux" },
          { label: "Acide", value: "Acide" },
          { label: "Argilo-sableux", value: "Argilo-sableux" },
        ],
      },
      schema: yup.string(),
    },
    rootType: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.rootType"),
      },
      schema: yup.string(),
    },
    habit: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.habit"),
      },
      schema: yup.string(),
    },
    protected: {
      type: "checkbox",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.protected"),
      },
      schema: yup.string(),
    },
    soilConstraints: {
      type: "select",
      category: "Environnement extérieur",
      component: {
        multiple: true,
        label: t("components:Tree.soilConstraints"),
      },
      schema: yup.string(),
    },
    aerianConstraint: {
      type: "checkbox",
      category: "Environnement extérieur",
      component: {
        label: t("components:Tree.aerianConstraint"),
      },
      schema: yup.string(),
    },
    lightning: {
      type: "checkbox",
      category: "Environnement extérieur",
      component: {
        label: t("components:Tree.lightning"),
      },
      schema: yup.string(),
    },
    watering: {
      type: "select",
      category: "Environnement extérieur",
      component: {
        multiple: true,
        label: t("components:Tree.watering"),
      },
      schema: yup.string(),
    },
    allergens: {
      type: "textfield",
      category: "Autre",
      component: {
        type: "number",
        label: t("components:Tree.allergens"),
      },
      schema: yup.string(),
    },
    remarks: {
      type: "textfield",
      category: "Autre",
      component: {
        label: t("components:Tree.remarks"),
      },
      schema: yup.string(),
    },
  };
}
