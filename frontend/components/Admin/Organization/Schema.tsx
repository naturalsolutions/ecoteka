import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { TOrganizationMode } from "@/index";

const organizationModes: TOrganizationMode[] = [
  "private",
  "open",
  "participatory",
];

const transformNumber = (value) => (isNaN(value) ? undefined : Number(value));

function sitem(value, t, tpath) {
  return {
    value,
    label: t(`${tpath}.${value}`),
  };
}

export default function useOrganizationSchema() {
  const { t } = useTranslation(["common", "components"]);

  return {
    name: {
      type: "textfield",
      component: {
        label: t("components.Organization.name"),
        required: true,
      },
      schema: yup.string().required(t("common.errors.required")),
    },
    mode: {
      type: "select",
      component: {
        required: true,
        label: t("components.Organization.applicationMode"),
        items: organizationModes.map((it) =>
          sitem(it, t, "components.Organization.modes")
        ),
      },
      schema: yup.string(),
    },
    owner_email: {
      type: "textfield",
      component: {
        label: t("components.Organization.ownerEmail"),
      },
      schema: yup.string(),
    },
    osmname: {
      type: "osmnamefield",
      component: {
        label: t("components.Organization.osmname.label"),
        placeholder: t("components.Organization.osmname.placeholder"),
        helperText: t("components.Organization.osmname.helperText"),
      },
      schema: yup.string(),
    },
    osm_id: {
      type: "textfield",
      component: {
        label: t("components.Organization.osmId.label"),
        placeholder: t("components.Organization.osmId.placeholder"),
      },
      schema: yup.string(),
    },
    osm_type: {
      type: "textfield",
      component: {
        label: t("components.Organization.osmType.label"),
        placeholder: t("components.Organization.osmType.placeholder"),
      },
      schema: yup.string(),
    },
  };
}
