import {
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  Input,
  InputLabel,
  Popover,
  TextField,
  TextFieldProps,
  Typography,
  withStyles,
} from "@material-ui/core";
import { DateRangePicker } from "materialui-daterange-picker";
import React, { useEffect } from "react";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { Controller } from "react-hook-form";
import { TextFieldsOutlined } from "@material-ui/icons";

type drprops = {
  name?: string;
  control?: any;
  error?: any;
  label?: string;
};

type tdaterange = {
  startDate?: Date;
  endDate?: Date;
};

const CalendarToogleIcon = withStyles({
  root: {
    cursor: "pointer",
  },
})(CalendarTodayIcon);

const ETKDateRangePicker: React.FC<drprops> = (props) => {
  const defaultValue = {
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
      render={({ onChange, onBlur, value, name }) => (
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
            <DateRangePicker
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

    rangefields[name] = <ETKDateRangePicker {...fieldProps} />;
  }

  return rangefields;
}
