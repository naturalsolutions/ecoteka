import {
  FormHelperText,
  Grid,
  Popover,
  TextField,
  TextFieldProps,
  withStyles,
} from "@material-ui/core";
import { DateRangePicker as DateRangePickerMUI } from "materialui-daterange-picker";
import React from "react";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Controller } from "react-hook-form";

type drprops = {
  name?: string;
  control?: any;
  error?: any;
  label?: string;
};

export interface DateRangePeriod {
  startDate?: Date;
  endDate?: Date;
}

const CalendarToogleIcon = withStyles({
  root: {
    cursor: "pointer",
  },
})(CalendarTodayIcon);

const DateRangePicker: React.FC<drprops> = (props) => {
  const defaultValue: DateRangePeriod = {
    startDate: new Date(),
    endDate: new Date(),
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggle = () => setAnchorEl(null);
  const onIconClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={defaultValue}
      render={({ onChange, value }) => (
        <React.Fragment>
          <Grid container direction="column">
            <TextField
              label={props.label}
              variant="filled"
              value={
                value.startDate.toDateString() +
                " > " +
                value.endDate.toDateString()
              }
              inputProps={{
                disabled: true,
              }}
              InputProps={{
                endAdornment: <CalendarToogleIcon onClick={onIconClick} />,
              }}
            />
            {Boolean(props.error) && (
              <FormHelperText>{props.error?.message}</FormHelperText>
            )}
          </Grid>
          <Popover open={Boolean(anchorEl)} anchorEl={anchorEl}>
            <DateRangePickerMUI
              open={Boolean(anchorEl)}
              toggle={toggle}
              closeOnClickOutside={true}
              onChange={(dr) => {
                onChange(dr);
                setAnchorEl(null);
              }}
            />
          </Popover>
        </React.Fragment>
      )}
    ></Controller>
  );
};

interface Fields {
  [key: string]: TextFieldProps;
}

export default function useDateRangeField(props): Fields {
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

    rangefields[name] = <DateRangePicker {...fieldProps} />;
  }

  return rangefields;
}
