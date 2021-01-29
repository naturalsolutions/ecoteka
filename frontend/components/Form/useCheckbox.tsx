import { Checkbox, CheckboxProps } from "@material-ui/core";

interface Fields {
  [key: string]: CheckboxProps;
}

interface ETKCheckboxProps {
  register: any;
  errors: any;
  fields: Fields;
}

export default function useTextField(props: ETKCheckboxProps): Fields {
  const checkboxes = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps: CheckboxProps = {
      checked: field.checked,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    checkboxes[name] = <Checkbox {...fieldProps} />;
  }

  return checkboxes;
}
