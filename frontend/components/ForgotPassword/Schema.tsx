import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useForgotPasswordSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    email: {
      type: "textfield",
      component: {
        label: t("components:Register.email"),
        required: true,
      },
      schema: yup
        .string()
        .email(t("common:errors.email"))
        .required(t("common:errors.required")),
    }
  };
}
