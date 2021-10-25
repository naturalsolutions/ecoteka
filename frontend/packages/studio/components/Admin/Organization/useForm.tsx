import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useOrganizationSchema from "@/components/Admin/Organization/Schema";

export default function useOrganizationForm() {
  const organizationSchema = useOrganizationSchema();
  const fields = Object.keys(organizationSchema);
  const shape = fields.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = organizationSchema[fieldName].schema;

    return accumulator;
  }, {});
  const schema = useMemo(() => yup.object().shape(shape), []);

  type OrganizationSchema = yup.InferType<typeof schema>;

  const methods = useForm<OrganizationSchema>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return {
    ...methods,
  };
}
