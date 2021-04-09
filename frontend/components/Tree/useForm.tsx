import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useTreeSchema from "@/components/Tree/Schema";

export default function useTreeForm() {
  const treeSchema = useTreeSchema();
  const fields = Object.keys(treeSchema);
  const shape = fields.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = treeSchema[fieldName].schema;

    return accumulator;
  }, {});
  const schema = useMemo(() => yup.object().shape(shape), []);

  type TreeSchema = yup.InferType<typeof schema>;

  const methods = useForm<TreeSchema>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  return {
    ...methods,
  };
}
