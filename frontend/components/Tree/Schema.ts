import * as yup from "yup";
import { useTranslation } from "react-i18next";

const transformNumber = (value) => (isNaN(value) ? undefined : Number(value));

export default function useTreeSchema() {
  const { t } = useTranslation(["components", "common"]);
  const soilTextureOptions = [
    "",
    "clay",
    "silt",
    "limestone",
    "sand",
    "acid",
    "sandyclay",
  ].map((option) => {
    return {
      label: t(`components.Tree.properties.soilTexture.${option}`),
      value: option,
    };
  });

  const rootsTypeOptions = ["", "swivel", "tracing", "oblique"].map(
    (option) => {
      return {
        label: t(`components.Tree.properties.rootsType.${option}`),
        value: option,
      };
    }
  );

  const shapeOptions = [
    "",
    "free",
    "semiFree",
    "form",
    "cat",
    "trumpet",
    "curtain",
    "pyramid",
    "ball",
    "cone",
  ].map((option) => {
    return {
      label: t("components.Tree.properties.shape", { returnObjects: true })[
        option
      ],
      value: option,
    };
  });

  return {
    canonicalName: {
      type: "treecanonicalfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.canonicalName"),
        placeholder: t("components.Tree.placeholder.canonicalName"),
        helperText: t("components.Tree.helperText.canonicalName"),
      },
      schema: yup.string(),
    },
    vernacularName: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.vernacularName"),
        placeholder: t("components.Tree.placeholder.vernacularName"),
        helperText: t("components.Tree.helperText.vernacularName"),
      },
      schema: yup.string(),
    },
    family: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.family"),
        placeholder: t("components.Tree.placeholder.family"),
        helperText: t("components.Tree.helperText.family"),
      } as any,
      schema: yup.string(),
    },
    genus: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.genus"),
        placeholder: t("components.Tree.placeholder.genus"),
        helperText: t("components.Tree.helperText.genus"),
      },
      schema: yup.string(),
    },
    species: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.species"),
        placeholder: t("components.Tree.placeholder.species"),
        helperText: t("components.Tree.helperText.species"),
      },
      schema: yup.string(),
    },
    cultivar: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.cultivar"),
        placeholder: t("components.Tree.placeholder.cultivar"),
        helperText: t("components.Tree.helperText.cultivar"),
      },
      schema: yup.string(),
    },
    townshipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components.Tree.properties.townshipCode"),
        placeholder: t("components.Tree.placeholder.townshipCode"),
        helperText: t("components.Tree.helperText.townshipCode"),
      },
      schema: yup.number().transform(transformNumber),
    },
    zipCode: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        type: "number",
        label: t("components.Tree.properties.zipCode"),
        placeholder: t("components.Tree.placeholder.zipCode"),
      },
      schema: yup.number().transform(transformNumber),
    },
    address: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.address"),
        placeholder: t("components.Tree.placeholder.address"),
      },
      schema: yup.string(),
    },
    zone: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.zone"),
        placeholder: t("components.Tree.placeholder.zone"),
        helperText: t("components.Tree.helperText.zone"),
      },
      schema: yup.string(),
    },
    code: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.code"),
        placeholder: t("components.Tree.placeholder.code"),
        helperText: t("components.Tree.helperText.code"),
      },
      schema: yup.string(),
    },
    plantationDate: {
      type: "textfield",
      category: "Identité de l'arbre",
      component: {
        label: t("components.Tree.properties.plantationDate"),
        placeholder: t("components.Tree.placeholder.plantationDate"),
      },
      schema: yup.string(),
    },
    height: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components.Tree.properties.height"),
        placeholder: t("components.Tree.properties.height"),
        helperText: t("components.Tree.helperText.height"),
      },
      schema: yup.number().transform(transformNumber),
    },
    diameter: {
      type: "textfield",
      category: "Caractéristiques",
      component: {
        type: "number",
        label: t("components.Tree.properties.diameter"),
        placeholder: t("components.Tree.placeholder.diameter"),
        helperText: t("components.Tree.helperText.diameter"),
      },
      schema: yup.number().transform(transformNumber),
    },
    soilTexture: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components.Tree.properties.soilTexture.label"),
        items: soilTextureOptions,
        formControlProps: {
          fullWidth: true,
          variant: "filled",
          size: "small",
        },
      },
      schema: yup.string(),
    },
    rootsType: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components.Tree.properties.rootsType.label"),
        items: rootsTypeOptions,
        formControlProps: {
          fullWidth: true,
          variant: "filled",
          size: "small",
        },
      },
      schema: yup.string(),
    },
    shape: {
      type: "select",
      category: "Caractéristiques",
      component: {
        label: t("components.Tree.properties.shape.label"),
        items: shapeOptions,
        formControlProps: {
          fullWidth: true,
          variant: "filled",
          size: "small",
        },
      },
      schema: yup.string(),
    },
    isProtected: {
      type: "switch",
      category: "Caractéristiques",
      component: {
        label: t("components.Tree.properties.isProtected"),
      },
      schema: yup.boolean(),
    },
    isTreeOfInterest: {
      type: "switch",
      category: "Caractéristiques",
      component: {
        label: t("components.Tree.properties.isTreeOfInterest"),
      },
      schema: yup.boolean(),
    },
    soilConstraints: {
      type: "textfield",
      category: "Environnement extérieur",
      component: {
        multiple: true,
        label: t("components.Tree.properties.soilConstraints"),
        helperText: t("components.Tree.helperText.soilConstraints"),
      },
      schema: yup.string(),
    },
    airConstraints: {
      type: "textfield",
      category: "Environnement extérieur",
      component: {
        label: t("components.Tree.properties.airConstraints"),
        helperText: t("components.Tree.helperText.airConstraints"),
      },
      schema: yup.string(),
    },
    isLit: {
      type: "switch",
      category: "Environnement extérieur",
      component: {
        label: t("components.Tree.properties.isLit"),
      },
      schema: yup.boolean(),
    },
    watering: {
      type: "textfield",
      category: "Environnement extérieur",
      component: {
        label: t("components.Tree.properties.watering"),
      },
      schema: yup.string(),
    },
    allergenicRiskScore: {
      type: "textfield",
      category: "Autres",
      component: {
        type: "number",
        label: t("components.Tree.properties.allergenicRiskScore"),
        placelholder: t("components.Tree.placelholder.allergenicRiskScore"),
        helperText: t("components.Tree.helperText.allergenicRiskScore"),
      },
      schema: yup.number().transform(transformNumber).positive().integer(),
    },
    notes: {
      type: "textfield",
      category: "Autres",
      component: {
        label: t("components.Tree.properties.notes"),
      },
      schema: yup.string(),
    },
  };
}
