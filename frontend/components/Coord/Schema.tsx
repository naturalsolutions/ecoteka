import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useCoordSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    lng: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Coord.lng"),
      },
      schema: yup.number().required(t("common:requiredField")),
    },
    lat: {
      type: "textfield",
      component: {
        type: "number",
        label: t("components:Coord.lat"),
      },
      schema: yup.number().required(t("common:Coord.requiredField")),
    },
  };
}
