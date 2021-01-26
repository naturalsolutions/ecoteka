import { TextField, TextFieldProps } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";

interface Fields {
  [key: string]: TextFieldProps;
}

interface ETKTextFieldProps {
  setValue: any;
  control: any;
  register: any;
  errors: any;
  fields: Fields;
}

export default function useAutocomplete(props: ETKTextFieldProps): Fields {
  const autocompleteFields = {};

  const setTaxonomicValues = (data) => {
    if (data) {
      const [genus, species] = data.t.split(" ");
      props.setValue("genus", genus);
      props.setValue("species", species);
    } else {
      props.setValue("genus", "");
      props.setValue("species", "");
    }
  };
  for (const name in props.fields) {
    const field = props.fields[name];
    const options = field.options;
    const defaultFieldProps: TextFieldProps = {
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
            onChange={(e, data) => {
              onChange(data);
              setTaxonomicValues(data);
            }}
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
        defaultValue={{
          id: 0,
          t: "",
        }}
        onChange={([, data]) => data}
        name={name}
        control={props.control}
        key={name}
      />
    );
  }
  return autocompleteFields;
}
