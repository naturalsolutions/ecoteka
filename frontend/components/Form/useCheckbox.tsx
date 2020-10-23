import {
  FormControl,
  FormControlLabel,
  CheckboxProps,
  Checkbox,
  FormHelperText,
} from "@material-ui/core";

interface Fields {
  [key: string]: CheckboxProps & { label: string };
}

interface ETKCheckboxProps {
  register: any;
  errors: any;
  control: any;
  fields: Fields;
}

export default function useCheckbox(props: ETKCheckboxProps): Fields {
  const checkboxes = {};

  for (const name in props.fields) {
    const field = props.fields[name];

    checkboxes[name] = (
      <FormControl
        fullWidth
        variant="filled"
        margin="dense"
        error={Boolean(props.errors[name])}
      >
        <FormControlLabel
          value={field.value}
          control={<Checkbox />}
          label={field.label}
          name={name}
          inputRef={props.register}
        />
        {Boolean(props.errors[name]) && (
          <FormHelperText>{props.errors[name]?.message}</FormHelperText>
        )}
      </FormControl>
    );
  }

  return checkboxes;
}
