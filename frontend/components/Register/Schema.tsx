import * as yup from "yup";
import { useTranslation } from "react-i18next";

function equalTo(ref: any, msg: any) {
  return yup.mixed().test({
    name: "equalTo",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value: any) {
      return value === this.resolve(ref);
    },
  });
}
yup.addMethod(yup.string, "equalTo", equalTo);

export default function useRegisterSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    full_name: {
      type: "textfield",
      component: {
        label: t("components.Register.fullName"),
        required: true,
      },
      schema: yup.string().required(t("common.errors.required")),
    },
    email: {
      type: "textfield",
      component: {
        label: t("components.Register.email"),
        required: true,
      },
      schema: yup
        .string()
        .email(t("common.errors.email"))
        .required(t("common.errors.required")),
    },
    organization: {
      type: "textfield",
      component: {
        label: t("components.Register.organization"),
        required: true,
      },
      schema: yup.string().required(t("common.errors.required")),
    },
    password: {
      type: "passwordfield",
      component: {
        label: t("components.Register.password"),
        required: true,
      },
      schema: yup.string().required(t("common.errors.required")),
    },
    password_confirm: {
      type: "passwordfield",
      component: {
        label: t("components.Register.passwordConfirm"),
        required: true,
      },
      schema: yup
        .string()
        .equalTo(yup.ref("password"), t("common.errors.passwordsShouldMatch"))
        .required(t("common.errors.required")),
    },
  };
}
