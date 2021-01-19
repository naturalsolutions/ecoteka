import { Switch, SwitchProps, FormControlLabel } from "@material-ui/core";
import { Controller } from "react-hook-form";

interface ExtendSwitchProps extends SwitchProps {
  label?: String;
}

interface Fields {
  [key: string]: ExtendSwitchProps;
}

interface ETKSwitchProps {
  control: any;
  register: any;
  errors: any;
  fields: Fields;
}

export default function useTextField(props: ETKSwitchProps): Fields {
  const switchFields = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const fieldProps = Object.assign({}, field);

    switchFields[name] = (
      <Switch {...fieldProps} inputRef={props.register} name={name} />
    );
  }

  return switchFields;
}
