import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../providers/AppContext";
import { apiRest } from "../../../lib/api";

export interface Organization {
  value: Number;
  label: string;
}

export default function useProfileSchema() {
  const { t } = useTranslation(["common", "components"]);
  const { user } = useAppContext();
  const [ organizations, setOrganizations] = useState<[Organization?]>([]);

  const makeRequest = async () => {
    try {
      const response = await apiRest.organizations.getAll();
      console.log("ok")
      console.log(response)
      setOrganizations(response.map((item) => {
        return { value: item.id, label: item.name }
      }))
    } catch (e) {
      setOrganizations([])
    }
  };

  useEffect(() => {
    makeRequest();
  }, []);

  return {
    full_name: {
      type: "textfield",
      component: {
        label: t("components:Register.fullName"),
        required: true,
        defaultValue: user.full_name
      },
      schema: yup.string().required(t("common:errors.required")),
    },
    organization_id: {
      type: "select",
      component: {
        label: t("components:Register.organization"),
        required: true,
        defaultValue: user.organization_id,
        items: organizations
      },
      schema: yup.string().required(t("common:errors.required")),
    }
  };
}
