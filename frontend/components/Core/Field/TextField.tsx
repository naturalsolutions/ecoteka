import { forwardRef } from "react";
import {
  makeStyles,
  TextField,
  TextFieldProps,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
    "&$disabled": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  inputLabel: {
    fontWeight: "bold",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
  },
}));

const CoreTextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const classes = useStyles();
    const { helperText, InputProps, ...rest } = props;

    return (
      <TextField
        {...rest}
        ref={ref}
        size="small"
        variant="filled"
        margin="dense"
        InputProps={{
          ...InputProps,
          className: classes.input,
        }}
        InputLabelProps={{
          shrink: true,
          className: classes.inputLabel,
        }}
        fullWidth
      />
    );
  }
);

export default CoreTextField;
