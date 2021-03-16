import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Controller } from "react-hook-form";

export interface DateRangePeriod {
  startDate?: Date;
  endDate?: Date;
}

interface DatePickerProps {
  control: any;
  label: string;
  name: string;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const defaultValue: DateRangePeriod = {
    startDate: new Date(),
    endDate: new Date(),
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        control={props.control}
        name={props.name}
        defaultValue={defaultValue}
        render={({ onChange, value }) => (
          <KeyboardDatePicker
            disableToolbar
            fullWidth
            variant="dialog"
            inputVariant="filled"
            format="dd/MM/yyyy"
            margin="normal"
            label={props.label}
            value={value}
            onChange={onChange}
          />
        )}
      ></Controller>
    </MuiPickersUtilsProvider>
  );
};

interface Fields {
  [key: string]: KeyboardDatePickerProps;
}

export default function useDateField(props): Fields {
  const rangefields = {};

  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps = {
      name,
      label: field.label,
      error: Boolean(props.errors[name]),
      control: props.control,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    rangefields[name] = <DatePicker {...fieldProps} />;
  }

  return rangefields;
}
