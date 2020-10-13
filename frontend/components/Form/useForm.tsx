import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextFieldProps, SelectProps } from "@material-ui/core";
import useTextField from "./useTextField";
import useSelect from "./useSelect";
import usePasswordField from "./usePasswordField";

interface useETKFormSchema {
  [key: string]: {
    type: string;
    component: TextFieldProps | SelectProps;
    schema: any;
  };
}

interface useETKFormProps {
  schema: useETKFormSchema;
}

export default function useETKForm(props: useETKFormProps) {
  const shape = {};
  const textfields = {};
  const passwordfields = {};
  const selects = {};

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
    }
  }

  const schema = yup.object().shape(shape);

  type useETKFormSchema = yup.InferType<typeof schema>;

  const form = useForm<useETKFormSchema>({
    resolver: yupResolver(schema),
  });

  const a = useTextField({ fields: textfields, ...form });
  const b = useSelect({ fields: selects, ...form });
  const c = usePasswordField({fields: passwordfields, ...form});
  const fields = Object.assign({}, a, b, c);

  return {
    fields,
    ...form,
  };
}
