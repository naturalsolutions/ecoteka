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

export default function useForgotPasswordLinkSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    new_password: {
      type: "passwordfield",
      component: {
        label: t("components:ForgotPasswordLink.password"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    confirm_new_password: {
      type: "passwordfield",
      component: {
        label: t("components:ForgotPasswordLink.passwordConfirm"),
        required: true,
      },
      schema: yup
        .string()
        .equalTo(yup.ref("new_password"), t("common:errors.passwordsShouldMatch"))
        .required(t("common:errors.required")),
    },
  };
}
