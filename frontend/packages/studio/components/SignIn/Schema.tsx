import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useSignInSchema() {
  const { t } = useTranslation("components");

  return {
    username: {
      type: "textfield",
      component: {
        type: "email",
        label: t("SignIn.labelUsername"),
        autoComplete: "email",
        inputProps: { "data-testid": "signin-form-email" },
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
        onKeyDown: undefined,
        inputProps: { "data-testid": "signin-form-password" },
      },
      schema: yup.string().required(t("SignIn.errorMessageRequiredField")),
    },
  };
}
