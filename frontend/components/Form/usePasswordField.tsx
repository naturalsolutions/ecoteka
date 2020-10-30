import { TextFieldProps } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

interface Fields {
  [key: string]: TextFieldProps;
}

interface ETKTextFieldProps {
  register: any;
  errors: any;
  fields: Fields;
}

export default function usePasswordField(props: ETKTextFieldProps): Fields {
  const textfields = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps: TextFieldProps = {
      name,
      inputRef: props.register,
      variant: "filled",
      margin: "dense",
      InputLabelProps: {
        shrink: true,
      },
      InputProps: {
        disableUnderline: true,
      },
      label: field.label,
      type: "password",
      fullWidth: true,
      error: Boolean(props.errors[name]),
      helperText: props.errors[name]?.message,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    textfields[name] = <TextField {...fieldProps} />;
  }

  return textfields;
}
