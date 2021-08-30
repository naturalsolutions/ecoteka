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

const AutocompleteMultiSelect = forwardRef<
  HTMLElement,
  AutocompleteMultiSelectProps
>((props, ref) => {
  const classes = useStyles();
  const {
    inputProps,
    label,
    items,
    error,
    errorMessage,
    defaultValues,
    ...autocompleteProps
  } = props;
  const { onChange, value } = autocompleteProps;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Item[]>([]);

  useEffect(() => {
    const selectedItems = value
      ? items.filter((item) => value.includes(item.value))
      : [];
    setSelectedValues(selectedItems);
  }, [value]);

  const handleOnChange = (newValues: Item[]) => {
    setSelectedValues(newValues);
    const changedValues = newValues.map((item) => item.value);
    onChange(changedValues);
  };

  return (
    <Autocomplete
      ref={ref}
      {...autocompleteProps}
      multiple
      disableCloseOnSelect
      value={selectedValues ? selectedValues : []}
      defaultValue={defaultValues}
      options={items.map((item) => item)}
      noOptionsText="Aucune valeur trouvée"
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      renderOption={(option, { selected }) => (
        <Fragment>
          <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
          {option.label}
        </Fragment>
      )}
      getOptionSelected={(option: Item, value) => {
        return option.value == value.value;
      }}
      onChange={(e, newValues: Item[]) => {
        handleOnChange(newValues);
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
          margin="normal"
          label={label}
          variant="outlined"
          helperText={error ? errorMessage : ""}
          error={error}
        />
      )}
    />
  );
});

export default AutocompleteMultiSelect;
