import { forwardRef } from "react";
import { es, enGB, fr } from "date-fns/locale";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

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

const DatePickerField = forwardRef<HTMLDivElement, KeyboardDatePickerProps>(
  (props, ref) => {
    const router = useRouter();
    const { t } = useTranslation(["common"]);
    const { onChange, inputProps, ...rest } = props;

    return (
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={setDateLocale(router.locale)}
      >
        <KeyboardDatePicker
          {...rest}
          disableToolbar
          fullWidth
          ref={ref}
          onChange={onChange}
          inputVariant="filled"
          variant="inline"
          format={setLocaleFormat(router.locale)}
          margin="dense"
          okLabel={t("common.buttons.confirm")}
          cancelLabel={t("common.buttons.cancel")}
        />
      </MuiPickersUtilsProvider>
    );
  }
);

export default DatePickerField;
