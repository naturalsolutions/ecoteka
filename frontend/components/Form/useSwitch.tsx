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

export default function useSwitch(props: ETKSwitchProps): Fields {
  const switchFields = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const fieldProps = Object.assign({}, field);

    switchFields[name] = (
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={props.control}
            render={(props) => (
              <Switch
                {...fieldProps}
                onChange={(e) => props.onChange(e.target.checked)}
                checked={props.value}
              />
            )}
          />
        }
        key={name}
        label={field.label}
      />
    );
  }

  return switchFields;
}
