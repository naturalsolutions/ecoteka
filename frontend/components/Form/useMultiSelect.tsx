import { ChangeEvent, forwardRef, Fragment, useState, useEffect } from "react";
import {
  makeStyles,
  Theme,
  TextFieldProps,
  Checkbox,
  Chip,
  TextField,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";
import { Controller } from "react-hook-form";

interface Fields {
  [key: string]: TextFieldProps | any;
}

interface ETKMultiSelectProps {
  setValue: any;
  control: any;
  register: any;
  errors: any;
  fields: Fields;
}

export interface Item {
  value: string;
  label: string;
}

export interface AutocompleteMultiSelectProps {
  inputProps: TextFieldProps;
  items: Item[];
  defaultValues?: string[];
  label: string;
  value?: string[];
  error: boolean;
  errorMessage?: string;
  onChange?(event: any): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function useMultiSelect({
  setValue,
  control,
  register,
  errors,
  fields,
}: ETKMultiSelectProps): Fields {
  const multiselects = {};

  const [open, setOpen] = useState<boolean>(false);
  // const [selectedValues, setSelectedValues] = useState<Item[]>([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const setValuesToItems = (values: string, items: any): any => {
    return values ? items.filter((item) => values.includes(item.value)) : [];
  };

  const handleOnChange = (newValues) => {
    setSelectedValues(newValues);
  };

  for (const name in fields) {
    const field = fields[name];
    const defaultFieldProps: TextFieldProps = {
      name,
      inputRef: register,
      variant: "filled",
      margin: "dense",
      InputProps: {
        disableUnderline: true,
      },
      label: field.label,
      placeholder: field.placeholder,
      type: field.type,
      fullWidth: true,
      error: Boolean(errors[name]),
      helperText: errors[name]?.message
        ? errors[name]?.message
        : field.helperText,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    multiselects[name] = (
      <Controller
        render={({ onChange, value, ...props }) => (
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={value ? setValuesToItems(value, field.items) : []}
            options={field.items.map((item) => item)}
            noOptionsText="Aucune valeur trouvée"
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            renderOption={(option, { selected }) => (
              <Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={selected}
                />
                {option.label}
              </Fragment>
            )}
            getOptionSelected={(option, value) => {
              return option.value == value.value;
            }}
            onChange={(e, newValues) => {
              handleOnChange(newValues);
              onChange(newValues.map((item) => item.value));
            }}
            getOptionLabel={(option) => option.label}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.label}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="dense"
                label={field.label}
                variant="outlined"
                helperText={Boolean(errors[name]) ? errors[name].message : ""}
                error={Boolean(errors[name])}
              />
            )}
          />
        )}
        name={name}
        control={control}
        defaultValue={[]}
      />
    );
  }

  return multiselects;
}
