import {
  FormControl,
  InputLabel,
  SelectProps,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Controller } from "react-hook-form";

interface MenuItemProps {
  value: string;
  label: string;
}

interface Fields {
  [key: string]: SelectProps & { items: MenuItemProps[] };
}

interface ETKSelectProps {
  register: any;
  errors: any;
  control: any;
  fields: Fields;
}

export default function useSelect(props: ETKSelectProps): Fields {
  const selects = {};

  for (const name in props.fields) {
    const field = props.fields[name];

    selects[name] = (
      <FormControl
        fullWidth
        variant="filled"
        margin="dense"
        error={Boolean(props.errors[name])}
      >
        <InputLabel id={`select-${name}`}>{field.label}</InputLabel>
        <Controller
          name={name}
          control={props.control}
          defaultValue="None"
          as={
            <Select
              disableUnderline
              labelId={`select-${name}`}
              label={field.label}
              defaultValue={field.defaultValue}
            >
              {field.items.map((item, id) => (
                <MenuItem key={`menu-item-${name}-${id}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          }
        />
      </FormControl>
    );
  }

  return selects;
}
