import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useTextField from "./useTextField";
import useSelect from "./useSelect";
import usePasswordField from "./usePasswordField";
import useCheckbox from "./useCheckbox";

interface useETKFormSchema {
  [key: string]: {
    type: string;
    component: any;
    schema: any;
  };
}

interface useETKFormProps {
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  schema: useETKFormSchema;
}

export default function useETKForm(props: useETKFormProps) {
  const shape = {};
  const textfields = {};
  const passwordfields = {};
  const selects = {};
  const checkboxes = {};

  for (const field in props.schema) {
    shape[field] = props.schema[field].schema;

    switch (props.schema[field].type) {
      case "textfield":
        textfields[field] = props.schema[field].component;
        break;
      case "passwordfield":
        passwordfields[field] = props.schema[field].component;
        break;
      case "select":
        selects[field] = props.schema[field].component;
        break;
      case "checkbox":
        checkboxes[field] = props.schema[field].component;
        break;
    }
  }

  const schema = yup.object().shape(shape);

  type useETKFormSchema = yup.InferType<typeof schema>;

  const form = useForm<useETKFormSchema>({
    mode: props.mode || "onSubmit",
    resolver: yupResolver(schema),
  });

  const a = useTextField({ fields: textfields, ...form });
  const b = useSelect({ fields: selects, ...form });
  const c = usePasswordField({ fields: passwordfields, ...form });
  const d = useCheckbox({ fields: checkboxes, ...form });
  const fields = Object.assign({}, a, b, c, d);

  return {
    fields,
    ...form,
  };
}
