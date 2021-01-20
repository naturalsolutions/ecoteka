import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useTreeSchema() {
  const { t } = useTranslation(["components", "common"]);

  return {
    family: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.family"),
      } as any,
      schema: yup.string().required(t("common:errors.required")),
    },
    gender: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.gender"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    specie: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.specie"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    cultivar: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.cultivar"),
      },
      schema: yup.string(),
    },
    vernacularName: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.vernacularName"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    townshipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.properties.townshipCode"),
      },
      schema: yup.string(),
    },
    zipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components:Tree.properties.zipCode"),
      },
      schema: yup.string(),
    },
    address: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.address"),
      },
      schema: yup.string(),
    },
    zone: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components:Tree.properties.zone"),
      },
      schema: yup.string(),
    },
    registrationNumber: {
      type: "textfield",
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
        label: t("components:Tree.properties.plantingDate"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    height: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components:Tree.properties.height"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    diameter: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components:Tree.properties.diameter"),
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    soilType: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.properties.soilType.label"),
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
        label: t("components:Tree.properties.rootType.label"),
      },
      schema: yup.string(),
    },
    habit: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.properties.habit.label"),
      },
      schema: yup.string(),
    },
    protected: {
      type: "switch",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.protected"),
        color: "primary",
      },
      schema: yup.boolean(),
    },
    remarkableTree: {
      type: "checkbox",
      category: "Caractéristiques",
      component: {
        label: t("components:Tree.remarkableTree"),
        color: "primary",
      },
      schema: yup.boolean(),
    },
    soilConstraints: {
      type: "select",
      category: "Environnement extérieur",
      component: {
        multiple: true,
        label: t("components:Tree.properties.soilConstraints"),
      },
      schema: yup.string(),
    },
    aerianConstraint: {
      type: "textfield",
      category: "Environnement extérieur",
      component: {
        label: t("components:Tree.properties.aerianConstraint"),
      },
      schema: yup.string(),
    },
    lightning: {
      type: "switch",
      category: "Environnement extérieur",
      component: {
        label: t("components:Tree.properties.lightning"),
        color: "primary",
      },
      schema: yup.boolean(),
    },
    watering: {
      type: "select",
      category: "Environnement extérieur",
      component: {
        multiple: true,
        label: t("components:Tree.properties.watering"),
      },
      schema: yup.string(),
    },
    allergens: {
      type: "textfield",
      category: "Autre",
      component: {
        type: "number",
        label: t("components:Tree.properties.allergens"),
      },
      schema: yup.string(),
    },
    remarks: {
      type: "textfield",
      category: "Autre",
      component: {
        label: t("components:Tree.properties.remarks"),
      },
      schema: yup.string(),
    },
  };
}
