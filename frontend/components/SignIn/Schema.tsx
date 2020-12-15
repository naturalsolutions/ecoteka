import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useContactSchema() {
  const { t } = useTranslation("components");

  return {
    username: {
      type: "textfield",
      component: {
        type: "email",
        label: t("SignIn.labelUsername"),
        autoComplete: "email",
      },
      schema: yup
        .string()
        .required(t("SignIn.errorMessageRequiredField"))
        .email(t("SignIn.errorMessageEmail")),
    },
    password: {
      type: "textfield",
      component: {
        type: "password",
        label: t("SignIn.labelPassword"),
        autoComplete: "current-password",
      },
      schema: yup.string().required(t("SignIn.errorMessageRequiredField")),
    },
  };
}
