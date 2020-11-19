import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useEtkTeamSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    name: {
      type: "textfield",
      component: {
        label: t("components:Team.name"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    }
  };
}
