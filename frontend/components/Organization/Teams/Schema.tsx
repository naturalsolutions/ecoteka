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
    },
    slug: {
      type: "textfield",
      component: {
        label: t("components:Team.slug"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    }
  };
}
