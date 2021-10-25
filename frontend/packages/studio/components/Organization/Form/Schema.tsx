import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useEtkOrganizationSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    name: {
      type: "textfield",
      component: {
        label: t("components.Organization.mode2"),
        required: true,
      },
      schema: yup.string().required(t("common.errors.required")),
    },
  };
}
