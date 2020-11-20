import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useEtkWorkingAreaSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    file: {
      type: "textfield",
      component: {
        label: t("components:Organization.WorkingArea.file"),
        required: true,
        type: 'file'
      },
      schema: yup.mixed() //TODO
    }
  };
}
