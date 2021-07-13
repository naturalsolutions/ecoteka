import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Controller } from "react-hook-form";
import { es, enGB, fr } from "date-fns/locale";
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";

export interface DateRangePeriod {
  startDate?: Date;
  endDate?: Date;
}

interface ResolverError {
  message: string;
  type: string;
}

interface DatePickerProps {
  control: any;
  label: string;
  name: string;
  error: ResolverError;
}

const setDateLocale = (locale: string) => {
  switch (locale) {
    case "fr":
      return fr;
    case "en":
      return enGB;
    case "es":
      return es;
    default:
      return fr;
  }
};

const setLocaleFormat = (locale: string) => {
  switch (locale) {
    case "fr":
      return "dd/MM/yyyy";
    case "en":
      return "yyyy/MM/dd";
    case "es":
      return "dd/MM/yyyy";
    default:
      return "dd/MM/yyyy";
  }
};

const DatePicker: React.FC<DatePickerProps> = ({
  control,
  label,
  name,
  error,
}) => {
  const router = useRouter();

  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils}
      locale={setDateLocale(router.locale)}
    >
      <Controller
        control={control}
        name={name}
        render={({ onChange, value }) => (
          <>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              variant="dialog"
              inputVariant="outlined"
              format={setLocaleFormat(router.locale)}
              margin="dense"
              label={label}
              value={value ? value : new Date()}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              error={Boolean(error)}
            />
            {error && (
              <Typography variant="caption" color="error">
                {error.message}
              </Typography>
            )}
          </>
        )}
      ></Controller>
    </MuiPickersUtilsProvider>
  );
};

interface Fields {
  [key: string]: KeyboardDatePickerProps;
}

export default function useDateField(props): Fields {
  const fields = {};
  for (const name in props.fields) {
    const field = props.fields[name];
    const defaultFieldProps = {
      name,
      label: field.label,
      error: Boolean(props.errors[name]),
      control: props.control,
    };

    const fieldProps = Object.assign({}, defaultFieldProps, field);

    fields[name] = <DatePicker {...fieldProps} />;
  }

  return fields;
}
