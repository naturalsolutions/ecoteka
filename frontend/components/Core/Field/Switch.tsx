import { Switch, FormControlLabel, SwitchProps } from "@material-ui/core";
import { forwardRef } from "react";

export interface CoreSwitchProps {
  label: string;
  switchProps?: SwitchProps;
  value?: any;
  onChange?: any;
}

const CoreSwitch = forwardRef<HTMLButtonElement, CoreSwitchProps>(
  (props, ref) => {
    const { switchProps, label, value, onChange } = props;

    return (
      <FormControlLabel
        label={label}
        control={
          <Switch
            {...switchProps}
            ref={ref}
            value={value}
            checked={value}
            color="primary"
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
        }
        labelPlacement="end"
      />
    );
  }
);

export default CoreSwitch;
