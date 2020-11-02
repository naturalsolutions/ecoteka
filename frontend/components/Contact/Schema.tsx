import * as yup from "yup";
import { useTranslation } from "react-i18next";

export default function useContactSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    last_name: {
      type: "textfield",
      component: {
        label: t("components:Contact.lastName"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    first_name: {
      type: "textfield",
      component: {
        label: t("components:Contact.firstName"),
        required: true,
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    email: {
      type: "textfield",
      component: {
        label: t("components:Contact.email"),
        required: true,
      },
      schema: yup
        .string()
        .email(t("common:errors.email"))
        .required(t("common:errors.required")),
    },
    phone_number: {
      type: "textfield",
      component: {
        label: t("components:Contact.phone"),
      },
      schema: yup.string(),
    },
    township: {
      type: "textfield",
      component: {
        label: t("components:Contact.township"),
      },
      schema: yup.string(),
    },
    contact_request: {
      type: "textfield",
      component: {
        label: t("components:Contact.contactRequest"),
        multiline: true,
        rows: 3,
        rowsMax: 6,
      },
      schema: yup.string(),
    },
    position: {
      type: "select",
      component: {
        label: t("components:Contact.position"),
        defaultValue: "None",
        items: [
          { label: t("components:Contact.positionItems.none"), value: "None" },
          {
            label: t("components:Contact.positionItems.greenSpacesManager"),
            value: "Responsable espaces verts",
          },
          {
            label: t(
              "components:Contact.positionItems.technicalServiceManagers"
            ),
            value: "Directeurs de services technique",
          },
          {
            label: t("components:Contact.positionItems.others"),
            value: "Autres",
          },
        ],
      },
      schema: yup.string(),
    },
  };
}
