import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useEtkTeamAreaSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    file: {
      type: "textfield",
      component: {
        label: t("components:TeamArea.file"),
        required: true,
        type: 'file'
      },
      schema: yup.mixed() //TODO
    }
  };
}
