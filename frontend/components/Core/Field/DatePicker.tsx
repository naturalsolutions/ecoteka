import { forwardRef } from "react";
import {
  makeStyles,
  TextField,
  Typography,
  TextFieldProps,
  Theme,
} from "@material-ui/core";
import { es, enGB, fr } from "date-fns/locale";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { useRouter } from "next/router";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

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

const DatePickerField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const classes = useStyles();
    const router = useRouter();
    console.log(props);
    const { onChange, inputProps, ...rest } = props;

    return (
      //   <TextField
      //     {...rest}
      //     ref={ref}
      //     size="small"
      //     variant="filled"
      //     margin="dense"
      //     InputProps={{
      //       ...InputProps,
      //       className: classes.input,
      //     }}
      //     InputLabelProps={{
      //       shrink: true,
      //       className: classes.inputLabel,
      //     }}
      //     fullWidth
      //   />
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={setDateLocale(router.locale)}
      >
        <KeyboardDatePicker
          {...inputProps}
          {...rest}
          disableToolbar
          fullWidth
          ref={ref}
          onChange={onChange}
          inputVariant="filled"
          variant="inline"
          format={setLocaleFormat(router.locale)}
          margin="dense"
        />
      </MuiPickersUtilsProvider>
    );
  }
);

export default DatePickerField;
