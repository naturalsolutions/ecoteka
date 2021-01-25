import { TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";

interface Fields {
  [key: string]: TextFieldProps;
}

interface ETKTextFieldProps {
  control: any;
  register: any;
  errors: any;
  options: any[];
  fields: Fields;
}

export default function useAutocomplete(
  props: ETKTextFieldProps
): ETKTextFieldProps {
  const autocompleteFields = {};
  console.log(props);
  for (const name in props.fields) {
    const field = props.fields[name];
    const options = field.options;
    console.log(options);
    const defaultFieldProps: ETKTextFieldProps = {
      name,
      inputRef: props.register,
      variant: "filled",
      margin: "dense",
      InputProps: {
        disableUnderline: true,
      },
      label: field.label,
      placeholder: field.placeholder,
      type: field.type,
      fullWidth: true,
      error: Boolean(props.errors[name]),
      helperText: props.errors[name]?.message
        ? props.errors[name]?.message
        : field.helperText,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);
    console.log(fieldProps);

    autocompleteFields[name] = (
      <Controller
        render={({ onChange, ...props }) => (
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.t}
            renderOption={(option) => (
              <span>
                {option.id} -{option.t}
              </span>
            )}
            onChange={(e, data) => onChange(data.t)}
            {...props}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={fieldProps.label}
                  helperText={fieldProps.helperText}
                  variant={fieldProps.variant}
                  margin={fieldProps.margin}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
                />
              );
            }}
          />
        )}
        onChange={([, data]) => data}
        defaultValue={{
          id: 839,
          t: "Acer yui",
        }}
        name={name}
        control={props.control}
        key={name}
      />
    );
  }
  console.log(autocompleteFields);
  return autocompleteFields;
}
