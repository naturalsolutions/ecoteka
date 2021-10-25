import {
  Select,
  MenuItem,
  SelectProps,
  FormControl,
  InputLabel,
  FormControlProps,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { ChangeEvent, forwardRef } from "react";

export interface Item {
  value: string;
  label: string;
}

export interface CoreSelectProps {
  items: Item[];
  label: string;
  formControlProps: FormControlProps;
  selectProps: SelectProps;
  value?: string;
  onChange?(event: ChangeEvent<{}>);
}

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  inputLabel: {
    fontWeight: "bold",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
  },
}));

const CoreSelect = forwardRef<HTMLElement, CoreSelectProps>((props, ref) => {
  const classes = useStyles();
  const { items, value, onChange, label, formControlProps, selectProps } =
    props;

  return (
    <FormControl {...formControlProps}>
      <InputLabel className={classes.inputLabel} shrink={true}>
        {label}
      </InputLabel>
      <Select
        {...selectProps}
        ref={ref}
        defaultValue=""
        value={value}
        className={classes.input}
        onChange={onChange}
      >
        {items.map((item) => {
          if (item.value !== "") {
            return (
              <MenuItem key={`${label}-${item.value}`} value={item.value}>
                {item.label}
              </MenuItem>
            );
          }

          return (
            <MenuItem key={`${label}-undefined`} value={""}>
              &nbsp;
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
});

export default CoreSelect;
