import { TextField, TextFieldProps } from "@material-ui/core";

interface Fields {
  [key: string]: TextFieldProps;
}

interface ETKTextFieldProps {
  register: any;
  errors: any;
  fields: Fields;
}

export default function useTextField(props: ETKTextFieldProps): Fields {
  const textfields = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps: TextFieldProps = {
      name,
      inputRef: props.register,
      variant: "filled",
      margin: "dense",
      InputProps: {
        disableUnderline: true,
      },
      label: field.label,
      type: field.type,
      fullWidth: true,
      error: Boolean(props.errors[name]),
      helperText: props.errors[name]?.message,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    textfields[name] = <TextField {...fieldProps} />;
  }

  return textfields;
}
