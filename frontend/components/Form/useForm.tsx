import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useTextField from "@/components/Form/useTextField";
import useSelect from "@/components/Form/useSelect";
import usePasswordField from "@/components/Form/usePasswordField";
import useDateRangeField from "@/components/Form/useDateRange";
import useSwitch from "@/components/Form/useSwitch";

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
  defaultValues?: any;
}

export default function useETKForm(props: useETKFormProps) {
  const shape = {};
  const textfields = {};
  const passwordfields = {};
  const selects = {};
  const dateranges = {};
  const switchs = {};

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
      case "daterange":
        dateranges[field] = props.schema[field].component;
        break;
      case "switch":
        switchs[field] = props.schema[field].component;
        break;
    }
  }

  const schema = yup.object().shape(shape);

  type useETKFormSchema = yup.InferType<typeof schema>;

  const form = useForm<useETKFormSchema>({
    mode: props.mode || "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: props.defaultValues,
  });

  const textfieldsComponents = useTextField({ fields: textfields, ...form });
  const selectsComponents = useSelect({ fields: selects, ...form });
  const passwordsComponents = usePasswordField({
    fields: passwordfields,
    ...form,
  });
  const dataragesComponents = useDateRangeField({
    fields: dateranges,
    ...form,
  });
  const switchsComponents = useSwitch({
    fields: switchs,
    ...form,
  });

  const fields = Object.assign(
    {},
    textfieldsComponents,
    selectsComponents,
    passwordsComponents,
    dataragesComponents,
    switchsComponents
  );

  return {
    fields,
    ...form,
  };
}
